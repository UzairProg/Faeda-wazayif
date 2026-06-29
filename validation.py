def validateRegister(email, phoneNumber, password, passwordProve):

    #password region
    if password != passwordProve:
        return "كلمة المرور و تأكيد كلمة المرور لا يتوافقان !"
    
    if len(password) < 8:
        return "يجب أن تكون كلمة المرور اكثر من 8 احرف"
    
    for i in phoneNumber:
        if i > '9' or i < '0':
            return "رقم الجوال غير صحيح"

def validatePassowrd(password, passwordProve):
    if password != passwordProve:
        return "كلمة المرور و تأكيد كلمة المرور لا يتوافقان !"
    
    if len(password) < 8:
        return "يجب أن تكون كلمة المرور اكثر من 8 احرف"
    
  

        
        
        
