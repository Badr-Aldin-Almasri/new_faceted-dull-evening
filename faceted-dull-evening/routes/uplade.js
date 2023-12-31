var express = require('express');
var router = express.Router();
var uploadFile = require ('./middelware.js')

router.post('/uplode' , async (req, res) => {
  try {
    await uploadFile(req, res);
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    res.status(200).send({
      message: "https://server.saudisauctions.com/app/file/" + req.file.originalname,
    });
    } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: "aaa". ${err}`,
    });
  }
});

module.exports = router;
