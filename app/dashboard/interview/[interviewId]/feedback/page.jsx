"use client"
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useParams } from 'next/navigation'


function feedback() {
const params=useParams();
console.log(params);

const [feedbacklist,setfeedbacklist]=useState([]);

    useEffect(()=>{
 getFeedback();
    },[])
    const getFeedback= async()=>{

      const rresult = await db.select().from(UserAnswer);
console.log(rresult);

        const result=await db.select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef,String(params.interviewId)))
        .orderBy(UserAnswer.id);
        console.log(result);
        setfeedbacklist(result)
        
       }
  return (
    <div className='p-10'>
        <h2 className='text-3xl font-bold text-green-500'>Congratulations!</h2>
   <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>
  <h2 className='text-primary text-lg my-3'>Your overall interview rating :<strong>7/10</strong></h2>
    <h2 className='text-sm  text-gray-500'>Find below interview question with correct answer,your answer</h2>
    
    {
      feedbacklist && feedbacklist.map((item,index)=>(
<Collapsible key={index}>
  <CollapsibleTrigger>Can I use this in my project?</CollapsibleTrigger>
  <CollapsibleContent>
    Yes. Free to use for personal and commercial projects. No attribution
    required.
  </CollapsibleContent>
</Collapsible>

      ))
    }
    
    </div>
  )
}

export default feedback