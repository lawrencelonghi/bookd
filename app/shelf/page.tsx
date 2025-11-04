'use client'
import {Tabs, Tab} from "@heroui/tabs";
import { AuthProvider } from "../contexts/AuthContext"
import React from "react"

 
 const ShelfPage = () => {

  

  return( 
    <AuthProvider>
      <section className="flex w-full items-center mt-18   flex-col">
      <Tabs aria-label="Options" size="lg" variant="bordered">

       <Tab key="reading" title="Reading">
        <div>

        </div>
       </Tab> 

       <Tab key="want to read" title="Want to read">
        <div>

        </div>
       </Tab> 

      </Tabs>  
      </section>    
    </AuthProvider>
    )
}

export default ShelfPage