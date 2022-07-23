import * as nodemailer from "nodemailer";
import * as hbs from "nodemailer-express-handlebars";
import path from "path";
class Mail {

    constructor(
        public to?: string,
        public subject?: string,
        public message?: string,
        public type?: string) { }


    sendMail() {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "",
                pass: ""
            }
        });
        const handlebarOptions = {
            viewEngine: {
                partialsDir: path.resolve('./assets/mail/'),
                layoutsDir: path.resolve('./assets/mail/'),
            },
            defaultLayout: false,
            viewPath: path.resolve('./assets/mail/'),
        }
        console.log(handlebarOptions);
        transporter.use('compile', hbs.default(handlebarOptions));

        let mailOptions = {
            from: "joaomigguel1864@gmail.com",
            to: this.to,
            subject: this.subject,
            template: 'main',
            context: {
                url: this.message,
                type: this.type,
                buttonText: this.type == 'Activate' ? 'Activate' : 'Recovery'
            },
            attachments: [
                { filename: "bee.png", path: "./assets/mail/images/bee.png", cid: "bee.png" },
                { filename: "Companify-Logo.png", path: "./assets/mail/images/Companify-Logo.png", cid: "Companify-Logo.png"  },
                { filename: "facebook2x.png", path: "./assets/mail/images/facebook2x.png", cid: "facebook2x.png"  },
                { filename: "footer.png", path: "./assets/mail/images/footer.png", cid: "footer.png"  },
                { filename: "Img4_2x.jpg", path: "./assets/mail/images/Img4_2x.jpg", cid: "Img4_2x.jpg"  },
                { filename: "instagram2x.png", path: "./assets/mail/images/instagram2x.png", cid: "instagram2x.png"  },
                { filename: "linkedin2x.png", path: "./assets/mail/images/linkedin2x.png", cid: "linkedin2x.png"  },
                { filename: "Logo-white.png", path: "./assets/mail/images/Logo-white.png", cid: "Logo-white.png"  },
                { filename: "twitter2x.png", path: "./assets/mail/images/twitter2x.png", cid: "twitter2x.png"  },
            ],
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
                return error;
            } else {
                return "Email sent with success";
            }
        });
    }


}

export { Mail }