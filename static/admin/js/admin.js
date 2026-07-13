/* ==============================================================================
 * Admin Dashboard — Core JavaScript
 * Sidebar toggle, confirmation modals, Chart.js helpers, and AJAX utilities.
 * ============================================================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ─── Sidebar Toggle ──────────────────────────────────────────
    const sidebar = document.getElementById('adminSidebar');
    const toggle = document.getElementById('sidebarToggle');

    if (toggle && sidebar) {
        // Create overlay for mobile
        let overlay = document.querySelector('.sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.classList.add('sidebar-overlay');
            document.body.appendChild(overlay);
        }

        toggle.addEventListener('click', function () {
            sidebar.classList.toggle('show');
            overlay.classList.toggle('show');
        });

        overlay.addEventListener('click', function () {
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
        });
    }

    // ─── Confirmation Modal ──────────────────────────────────────
    const confirmModal = document.getElementById('confirmModal');
    if (confirmModal) {
        const bsModal = new bootstrap.Modal(confirmModal);
        const form = document.getElementById('confirmModalForm');
        const titleEl = document.getElementById('confirmModalTitle');
        const bodyEl = document.getElementById('confirmModalBody');
        const btnEl = document.getElementById('confirmModalBtn');

        // Any element with [data-confirm] will open the modal
        document.addEventListener('click', function (e) {
            const trigger = e.target.closest('[data-confirm]');
            if (!trigger) return;

            e.preventDefault();

            const action = trigger.getAttribute('data-confirm-action') || trigger.getAttribute('href');
            const title = trigger.getAttribute('data-confirm-title') || 'تأكيد العملية';
            const message = trigger.getAttribute('data-confirm') || 'هل أنت متأكد من هذا الإجراء؟';
            const btnText = trigger.getAttribute('data-confirm-btn') || 'تأكيد';
            const btnClass = trigger.getAttribute('data-confirm-class') || 'btn-danger';

            titleEl.textContent = title;
            bodyEl.textContent = message;
            btnEl.textContent = btnText;
            btnEl.className = 'btn ' + btnClass;
            form.setAttribute('action', action);

            // Pass hidden fields if specified
            const hiddenFields = trigger.getAttribute('data-confirm-fields');
            // Clear old hidden fields
            form.querySelectorAll('input[type="hidden"]').forEach(el => el.remove());
            if (hiddenFields) {
                try {
                    const fields = JSON.parse(hiddenFields);
                    Object.keys(fields).forEach(key => {
                        const input = document.createElement('input');
                        input.type = 'hidden';
                        input.name = key;
                        input.value = fields[key];
                        form.appendChild(input);
                    });
                } catch (err) { /* skip */ }
            }

            bsModal.show();
        });
    }

    // ─── Auto-dismiss alerts ─────────────────────────────────────
    document.querySelectorAll('.admin-alert').forEach(function (alert) {
        setTimeout(function () {
            const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
            if (bsAlert) bsAlert.close();
        }, 5000);
    });

    // ─── Profile Tabs ────────────────────────────────────────────
    document.querySelectorAll('.profile-tab').forEach(function (tab) {
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('data-tab');
            if (!target) return;

            // Deactivate all tabs and panes
            document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.profile-tab-pane').forEach(p => p.style.display = 'none');

            // Activate clicked tab and its pane
            this.classList.add('active');
            const pane = document.getElementById(target);
            if (pane) pane.style.display = 'block';
        });
    });

    // ─── Form Filter Auto-submit ─────────────────────────────────
    document.querySelectorAll('.admin-filter-select').forEach(function (select) {
        select.addEventListener('change', function () {
            this.closest('form').submit();
        });
    });

});


// ─── Chart.js Dashboard Helpers ──────────────────────────────────

/**
 * Initialize the user growth line chart on the dashboard.
 * @param {string} canvasId - Canvas element ID
 * @param {string} apiUrl - URL to fetch chart data JSON
 */
function initUserGrowthChart(canvasId, apiUrl) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            new Chart(canvas, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: data.datasets.map(ds => ({
                        ...ds,
                        tension: 0.4,
                        borderWidth: 2.5,
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        fill: true,
                        backgroundColor: ds.borderColor + '10',
                    })),
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            rtl: true,
                            labels: {
                                font: { family: 'Almarai', weight: '700', size: 12 },
                                usePointStyle: true,
                                padding: 20,
                            },
                        },
                        tooltip: {
                            rtl: true,
                            titleFont: { family: 'Almarai' },
                            bodyFont: { family: 'Almarai' },
                            backgroundColor: '#1A1F36',
                            cornerRadius: 10,
                            padding: 12,
                        },
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { font: { family: 'Almarai', size: 11 }, color: '#94A3B8' },
                        },
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0,0,0,0.04)' },
                            ticks: { font: { family: 'Almarai', size: 11 }, color: '#94A3B8' },
                        },
                    },
                },
            });
        })
        .catch(err => console.error('Chart load error:', err));
}

/**
 * Initialize the roles distribution pie/doughnut chart on the dashboard.
 * @param {string} canvasId - Canvas element ID
 * @param {string} apiUrl - URL to fetch chart data JSON
 */
function initRolesChart(canvasId, apiUrl) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            new Chart(canvas, {
                type: 'doughnut',
                data: {
                    labels: data.labels,
                    datasets: [{
                        data: data.data,
                        backgroundColor: data.colors,
                        borderWidth: 0,
                        hoverOffset: 8,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: {
                        legend: {
                            rtl: true,
                            position: 'bottom',
                            labels: {
                                font: { family: 'Almarai', weight: '700', size: 12 },
                                usePointStyle: true,
                                padding: 20,
                            },
                        },
                        tooltip: {
                            rtl: true,
                            titleFont: { family: 'Almarai' },
                            bodyFont: { family: 'Almarai' },
                            backgroundColor: '#1A1F36',
                            cornerRadius: 10,
                            padding: 12,
                        },
                    },
                },
            });
        })
        .catch(err => console.error('Chart load error:', err));
}
