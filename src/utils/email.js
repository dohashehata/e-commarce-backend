import nodemailer from 'nodemailer'

export const sendEmail = async ({to="doha", subject='test email',  html= 'test email'}) => {
    const transPorter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
            
        }
    })
    const info =await transPorter.sendMail({
        from: '"doha"<dohashehata7@gmail.com>',
            to,
            subject,
            html
    })

    return info

  
}