const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuid4 } = require('uuid');


let storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, 'uploads/'),
	filename: (req, file, cb) => {
		const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
            cb(null, uniqueName);//date-9digituniquecode-.pdf/.jpg
	},
});

let upload = multer({
	storage,
	limit: { fileSize: 1000000 * 100}, //file size limit
}).single('myfile');




router.post('/', (req, res) => {
	//Validate Request
	

	//Store file
		upload(req, res, async (err) => {
            if(!req.file) {
                return res.json({ error : 'All fields are required.'});
            }

			if(err) {
				return res.status(500).send({ error: err.message })
			}
		//Store into database
			const file = new File({
				filename: req.file.filename,
				uuid: uuid4(),
				path: req.file.path,
				size: req.file.size
			});
			const response = await file.save();
			return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}`})
            //http://localhost:3000/files/uniqueid

		});


	


	//Response -> Link

});

module.exports = router;