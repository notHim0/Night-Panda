const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
	sgMail
		.send({
			to      : email,
			from    : 'md.shayan247@gmail.com',
			subject : 'Welcome to Night panda!',
			text    : `Welcome to panda family ${name}, yip yip!`
		})
		.then(console.log('message sent'));
};

const sendCancelationEmail = (email, name) => {
	sgMail
		.send({
			to      : email,
			from    : 'md.shayan247@gmail.com',
			subject : `We're sorry to let you down ${name}`,
			text    :
				"We're sorry to see you go, is there anything we could have done better?. You can register your complains at shoveitupyour@asshole"
		})
		.then(console.log('cancelation message sent'));
};
module.exports = {
	sendWelcomeEmail,
	sendCancelationEmail
};
