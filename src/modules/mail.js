const nodemailer=require('nodemailer');
	const testAccount=nodemailer.createTestAccount();

	const transporter=nodemailer.createTransport({
		service: 'Gmail',
		auth:{
			user:process.env.MAILUSER,
			pass:process.env.MAILPASS,
		},
	});

module.exports=transporter;