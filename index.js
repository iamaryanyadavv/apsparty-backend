const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const bodyParser = require('body-parser');
const Multer = require('multer');
const fs = require("fs");
const path = require('path');

const app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());

const sheetID = '1zD5EFH3DQKeJhIG_r81l8ddhvf24En9B7JL3D0Mt0hQ'
const fifadriveID = '1IFXyRrdGFan5rbCWM43vMMGjTix9CACY'
const coddriveID = '1iT2T3pv4eg1CV_grQxTm3eutJPShYfnK'
const nbadriveID = '1XHcaQyLLDE67ovrBRG491ruwFZ7WZXDY'
const rldriveID = '1R0aoxIws64NnabJDIW9Eef_1c1r7FhBA'

app.listen(3001, (req,res)=>{
    console.log("Running on Port: 3001")
});



//FIFA




//COD

// GET request to get COD OTAT data
app.get('/cod/otat', async (req,res)=>{
    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets'
    })
    const client = await auth.getClient();
    const googleSheets = google.sheets({version: 'v4', auth: client});
    const CODOTAT = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId: sheetID,
        range: 'COD OTAT!A2:J65'
    })
    res.send(CODOTAT.data);
})

// GET request to get COD registered emails p1 data
app.get('/cod/otat/emails1', async (req,res)=>{
    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets'
    })
    const client = await auth.getClient();
    const googleSheets = google.sheets({version: 'v4', auth: client});
    const CODOTATemails1 = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId: sheetID,
        range: 'COD OTAT!D2:D256'
    })
    res.send(CODOTATemails1.data);
})

// GET request to get COD registered emails p1 data
app.get('/cod/otat/emails2', async (req,res)=>{
    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets'
    })
    const client = await auth.getClient();
    const googleSheets = google.sheets({version: 'v4', auth: client});
    const CODOTATemails2 = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId: sheetID,
        range: 'COD OTAT!H2:H256'
    })
    res.send(CODOTATemails2.data);
})

// POST request to put COD OTAT form duo data
app.post('/cod/otat', async (req, res) =>{
    console.log(req)
    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets'
    })
    const client = await auth.getClient();
    const googleSheets = google.sheets({version: 'v4', auth: client});
    const response = await googleSheets.spreadsheets.values.append({
        spreadsheetId: sheetID,
        range: "COD OTAT",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [[
                req.body.teamname,
                req.body.participantone,
                req.body.participantonephone,
                req.body.participantoneemail,
                req.body.participantonebatch,
                req.body.participanttwo,
                req.body.participanttwophone,
                req.body.participanttwoemail,
                req.body.participanttwobatch,
                req.body.proficiency
            ]],
        },
        
    });
    res.send(response)
} )

//POST request to put COD payment picture in Google Drive
    // function to store player image file locally first, and also update the name
    const codmulter = Multer({
        storage: Multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './images/cod');
        },
        filename: function (req, file, callback) {
            callback(null, file.originalname);
        },
        }),
        limits: {
        fileSize: 5 * 1024 * 1024,
        },
    });

    // function to delete the locally stored image file after uploading to google drive
    const deletePlayerFile = (filePath) => {
        fs.unlink(filePath, () => {
            console.log("cod image file deleted");
        });
    };

    // POST request to upload player image to google drive folder
    app.post('/cod', codmulter.single('file') ,async (req, res) => {
        const auth = new google.auth.GoogleAuth({
            keyFile: 'credentials.json',
            scopes: 'https://www.googleapis.com/auth/drive'
        })
        const googleDrive = google.drive({ version: "v3", auth });
        const fileMetadata = {
            name: req.file.originalname,
            parents: [coddriveID]
        };
        // const bufferStream = new stream.PassThrough()
        // bufferStream.end(req.body.file.buffer);
        const media = {
            mimeType: req.file.mimetype,
            body: fs.createReadStream(req.file.path)
        };
        const response = await googleDrive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: "id",
        });
        deletePlayerFile(req.file.path);
    })




//NBA




//Rocket League




