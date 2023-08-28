import OpenAI from 'openai';
import { config } from 'dotenv';

import express from 'express';
import bodyParser from 'body-parser';
config();

const openai=new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// const {Configuration, OpenAIApi}  = require('openai');
const server = express();
const PORT = process.env.Port || 3000;



server.use(bodyParser.json());


server.post('/api/summarize', async (req, res) => {
  const rawContent = req.body.content;
  const content = rawContent.replace(/<[^>]+>/g, '');
  
  const buttonClicked = req.body.buttonClicked; // Get the buttonClicked value from the request body
  
  if (buttonClicked === 'summary') {
    // Implement your summarization logic here
    
    const summarizedContent =await summarizeText(content)
    console.log(summarizedContent);
   
  
    // Send the summarized content back to the extension
    res.json({summarizedContent});
    
  } 
  
  else if (buttonClicked === 'majorPoints') {
    // Implement your major points logic here
    const majorPoints = await MajorPointsGenerator(content);
    console.log(majorPoints);
    // Send the major points back to the extension
    
    res.json({ majorPoints});
    
  } else {
    // Handle the case where the button wasn't clicked
    res.status(400).json({ error: "Button not clicked" });
  }
});
server.listen(PORT, () => {
  console.log(`API server is running on port ${PORT}`);
});


async function summarizeText(inputText) {
  console.log(inputText.length);
  const content  = "";
  const requiredContent=inputText.length>10000?`${content}${inputText.slice(0,10000)}`:inputText;
  

  try {
    const response = await openai.chat.completions.create({
        messages: [{role: 'user', content:`Summarize the following text:\n"${requiredContent}"\nSummary:`}],
       model: "gpt-3.5-turbo", 
    });
    const messageObject = response.choices[0].message;
    const messageString = JSON.stringify(messageObject.content);
    //console.log(messageString);
    
    return(messageString);
    
    
  }
  catch (error) {
    console.error('Error:', error.message);
    return error.message;
  }
}


// Major Points generator

async function MajorPointsGenerator(inputText) {
  console.log(inputText.length);
  const content  = "";
  const requiredContent=inputText.length>10000?`${content}${inputText.slice(0,10000)}`:inputText;
  console.log(requiredContent);

  try {
    const response = await openai.chat.completions.create({
        messages: [{role: 'user', content:`Generate moajor points from below text separetd by \n :\n"${requiredContent}":`}],
       model: "gpt-3.5-turbo", 
    });
    const messageObject = response.choices[0].message;
    const messageString = JSON.stringify(messageObject.content);
    // console.log(messageObject);
    // console.log(messageString);
    
    return(messageString);
    
    
  }
  catch (error) {
    console.error('Error:', error.message);
    return error.message;
  }
}



