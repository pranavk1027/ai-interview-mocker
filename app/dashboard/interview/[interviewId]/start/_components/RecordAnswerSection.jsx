'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAimodal'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { db } from '@/utils/db'

function RecordAnswerSection({interviewData,mockInterviewQuestion,activequestionindex}) {
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
      } = useSpeechToText ({
        continuous: true,
        useLegacyResults: false
      });

 const [userAnswer,setAnswer]=useState("")
const [loading,setloading]=useState(false );

const {user}=useUser();



      useEffect(()=>{

   results.map((result)=>(
    setAnswer(prevAns=>prevAns+result?.transcript)
   ))
      },[results])

      useEffect(()=>{
        if(!isRecording && userAnswer.length>10){
          UpdateUserAnswer();
        }
      },[userAnswer])




const StartStopRecording=async()=>{
    if(isRecording){

        
        stopSpeechToText()
        
       
        
    }else {
        startSpeechToText();
    }
}


 const UpdateUserAnswer=async()=>{
  
  console.log(userAnswer);
  
  setloading(true);
  const feedbackPrompt="Question:"+mockInterviewQuestion[activequestionindex]?.Question+
  ",User Answer:"+userAnswer+",Depending on question and answer for given interview quesion"+
  "please give us rating for answer and feedback as area of improvement if any "+
  "in just 3 to 5 lines to improve it in JSON  format with rating field and feedback field";


  const result =await chatSession.sendMessage(feedbackPrompt);

  const mockJSONresp=(result.response.text()).replace('```json','').replace('```','');

  console.log(mockJSONresp);
  const JsonFeedbackResp=JSON.parse(mockJSONresp);

  const resp=await db.insert(userAnswer).values({
       mockIdRef:interviewData?.mockId,
       question:mockInterviewQuestion[activequestionindex]?.Question,
       correctAns:mockInterviewQuestion[activequestionindex]?.answer,
       userAns:userAnswer,
       feedback:JsonFeedbackResp?.feedback,
       rating:JsonFeedbackResp?.rating,
       userEmail:user?.primaryEmailAddress.emailAddress,
       createdAt:moment().format('DD-MM-yyyy')

  })
  if(resp){
      toast('User Answer recorder successfully')
 
  setAnswer('');
 setResults([])
 }
 setResults([])
 setloading(false);
 }

  return (
   <div className='flex items-center justify-center flex-col '>
     <div className='flex flex-col my-20 justify-center items-center bg-black rounded-lg p-5'>
        <Image src={'/webcam1.png'} width={200} height={200} className='absolute'  alt='logo'/>
         <Webcam  mirrored={true} 
          style={{
            height:300,
            width:'100%',
            zIndex:10
          }}
          />
          
    </div>
    <Button disabled={loading} variant="outline" className="my-10" onClick={StartStopRecording}>
        {isRecording? 
        <h2 className='text-red-600 animate-pulse flex gap-2 items-center'><StopCircle/>Stop Recording</h2>:
       <h2 className='text-primary flex gap-2 items-center'> <Mic/>Record Answer</h2> }
       </Button>

       {/* <Button onClick={()=>console.log(userAnswer)}>Show userAnswer</Button>
        */}
    
   </div>
  )
}

export default RecordAnswerSection