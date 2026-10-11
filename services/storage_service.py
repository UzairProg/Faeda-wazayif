# ==============================================================================
# services/storage_service.py
# ==============================================================================
# Unified Cloud & Local Storage Service for Faeda Jobs.
# Powered by Cloudinary Object Storage with automatic fallback to local disk.
# Supports Images, PDF CVs, Commercial Registers, and Video/Document Assets.
# ==============================================================================

import os
import uuid
import logging
from typing import Optional, Union, BinaryIO
from dotenv import load_dotenv
from flask import current_app

load_dotenv()

try:
    import cloudinary
    import cloudinary.uploader
    import cloudinary.api
    CLOUDINARY_AVAILABLE = True
except ImportError:
    CLOUDINARY_AVAILABLE = False

logger = logging.getLogger(__name__)


def is_cloudinary_configured() -> bool:
    """Return True if Cloudinary credentials are fully configured in app or environment."""
    if not CLOUDINARY_AVAILABLE:
        return False
    
    cloud_name = os.environ.get('CLOUDINARY_CLOUD_NAME')
    api_key = os.environ.get('CLOUDINARY_API_KEY')
    api_secret = os.environ.get('CLOUDINARY_API_SECRET')

    if not (cloud_name and api_key and api_secret):
        try:
            if current_app:
                cloud_name = current_app.config.get('CLOUDINARY_CLOUD_NAME')
                api_key = current_app.config.get('CLOUDINARY_API_KEY')
                api_secret = current_app.config.get('CLOUDINARY_API_SECRET')
        except Exception:
            pass

    return bool(cloud_name and api_key and api_secret)


def configure_cloudinary():
    """Initialize Cloudinary SDK with active credentials."""
    if not is_cloudinary_configured():
        return False
    
    cloud_name = os.environ.get('CLOUDINARY_CLOUD_NAME') or (current_app and current_app.config.get('CLOUDINARY_CLOUD_NAME'))
    api_key = os.environ.get('CLOUDINARY_API_KEY') or (current_app and current_app.config.get('CLOUDINARY_API_KEY'))
    api_secret = os.environ.get('CLOUDINARY_API_SECRET') or (current_app and current_app.config.get('CLOUDINARY_API_SECRET'))

    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret,
        secure=True
    )
    return True


def upload_to_storage(
    file_source: Union[str, BinaryIO, object],
    folder: str = "faeda/general",
    resource_type: str = "auto",
    custom_filename: Optional[str] = None,
    local_dir: Optional[str] = None
) -> dict:
    """
    Upload a file to Cloudinary if configured; otherwise store on local disk.
    
    Args:
        file_source: File path, file-like object, or Werkzeug FileStorage.
        folder: Cloudinary subfolder path (e.g. 'faeda/cvs', 'faeda/logos').
        resource_type: 'image', 'raw', or 'auto'.
        custom_filename: Desired target file name or public_id stem.
        local_dir: Absolute path to local upload directory for disk fallback.

    Returns:
        dict: {
            "success": bool,
            "url": str,              # Public HTTP(S) URL
            "stored_filename": str,  # URL or filename stored in DB column
            "public_id": str,
            "storage_type": 'cloudinary' | 'local',
            "size_bytes": int
        }
    """
    # 1. Try Cloudinary upload if configured (and not running in isolated unit test suite)
    is_test = False
    try:
        if current_app and current_app.config.get('TESTING'):
            is_test = True
    except Exception:
        pass

    if is_cloudinary_configured() and not is_test:
        try:
            configure_cloudinary()
            clean_id = custom_filename.rsplit('.', 1)[0] if custom_filename else str(uuid.uuid4())
            upload_kwargs = {
                "folder": folder,
                "public_id": clean_id,
                "resource_type": resource_type,
                "overwrite": True
            }
            res = cloudinary.uploader.upload(file_source, **upload_kwargs)
            secure_url = res.get("secure_url") or res.get("url")
            public_id = res.get("public_id")
            
            logger.info("Cloudinary upload successful: %s -> %s", public_id, secure_url)
            return {
                "success": True,
                "url": secure_url,
                "stored_filename": secure_url,  # Can be stored directly in db
                "public_id": public_id,
                "storage_type": "cloudinary",
                "size_bytes": res.get("bytes", 0)
            }
        except Exception as e:
            logger.warning("Cloudinary upload failed, falling back to local disk: %s", e)

    # 2. Local disk fallback
    if local_dir:
        os.makedirs(local_dir, exist_ok=True)
        filename = custom_filename or (
            secure_filename(getattr(file_source, 'filename', '')) or f"{uuid.uuid4().hex}"
        )
        dest_path = os.path.join(local_dir, filename)

        if hasattr(file_source, 'save'):
            file_source.save(dest_path)
        elif hasattr(file_source, 'read'):
            with open(dest_path, 'wb') as f:
                f.write(file_source.read())
        elif isinstance(file_source, str) and os.path.exists(file_source) and file_source != dest_path:
            import shutil
            shutil.copy2(file_source, dest_path)

        size = os.path.getsize(dest_path) if os.path.exists(dest_path) else 0
        return {
            "success": True,
            "url": f"/static/uploads/{filename}",
            "stored_filename": filename,
            "public_id": filename,
            "storage_type": "local",
            "size_bytes": size
        }

    return {
        "success": False,
        "error": "Storage configuration unavailable (no cloud or local dir specified)",
        "url": "",
        "stored_filename": ""
    }


def resolve_file_url(
    stored_path_or_url: Optional[str],
    fallback_route_prefix: str = "/download_image/"
) -> Optional[str]:
    """
    Given a DB column value (either a Cloudinary URL or a local filename),
    resolve to a valid, reachable public HTTP URL.
    """
    if not stored_path_or_url:
        return None
    
    clean_val = str(stored_path_or_url).strip()
    if not clean_val or clean_val.lower() in ('null', 'none', 'undefined'):
        return None

    # Already an absolute HTTP(S) URL (Cloudinary or CDN)
    if clean_val.startswith('http://') or clean_val.startswith('https://'):
        return clean_val

    # Relative filename stored locally
    if not fallback_route_prefix.endswith('/'):
        fallback_route_prefix += '/'
    return f"{fallback_route_prefix}{clean_val}"


def delete_from_storage(public_id_or_url: str, resource_type: str = "image") -> bool:
    """Delete an asset from Cloudinary if it is a cloud asset."""
    if not public_id_or_url or not is_cloudinary_configured():
        return False

    try:
        configure_cloudinary()
        # Extract public_id if full URL was provided
        public_id = public_id_or_url
        if 'res.cloudinary.com' in public_id:
            # Format: https://res.cloudinary.com/<cloud>/image/upload/v12345/<folder>/<id>.ext
            parts = public_id.split('/upload/')
            if len(parts) > 1:
                after_upload = parts[1]
                # strip version if present (e.g. v12345/)
                if after_upload.startswith('v') and '/' in after_upload:
                    after_upload = after_upload.split('/', 1)[1]
                # strip extension
                public_id = after_upload.rsplit('.', 1)[0]

        res = cloudinary.uploader.destroy(public_id, resource_type=resource_type)
        return res.get("result") == "ok"
    except Exception as e:
        logger.warning("Failed to delete from Cloudinary: %s", e)
        return False
