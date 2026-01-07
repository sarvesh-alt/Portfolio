"use client"

import { motion } from "framer-motion"
import { StarField } from "@/components/StarField"
import { Dumbbell, Utensils, Activity, Calendar } from "lucide-react"
import Image from "next/image"

export default function Hobbies() {
  return (
    <div className="flex flex-col w-full min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <StarField />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto w-full z-10"
      >
        <h1 className="text-4xl font-bold mb-6 text-center">
          <span className="text-primary">Active</span> Lifestyle & Hobbies
        </h1>
        
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          I believe that discipline in physical health translates to discipline in professional life. 
          Maintaining an active lifestyle helps me stay focused, energetic, and consistent in my work.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-xl flex flex-col items-center text-center hover:border-primary/50 transition-colors">
            <div className="p-3 bg-primary/10 rounded-full mb-4">
              <Dumbbell className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Workout Routine</h3>
            <p className="text-muted-foreground">
              Consistently hitting the gym 3 times a week to build strength and endurance.
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-xl flex flex-col items-center text-center hover:border-primary/50 transition-colors">
            <div className="p-3 bg-primary/10 rounded-full mb-4">
              <Utensils className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Clean Eating</h3>
            <p className="text-muted-foreground">
              Fueling my body with clean, nutritious food to maintain high energy levels throughout the day.
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-xl flex flex-col items-center text-center hover:border-primary/50 transition-colors">
            <div className="p-3 bg-primary/10 rounded-full mb-4">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Consistency</h3>
            <p className="text-muted-foreground">
              Dedication to the process, showing up even when it's tough, just like in solving complex engineering problems.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-center mb-8">Progress & Dedication</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Placeholder for Progress Photo 1 */}
            <div className="group relative aspect-[4/5] bg-muted/30 rounded-2xl overflow-hidden border border-border flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                <p className="font-medium">Gym Progress</p>
              </div>
              <div className="text-center p-6">
                <Dumbbell className="w-16 h-16 text-muted-foreground/20 mx-auto" />
              </div>
            </div>

            {/* Placeholder for Progress Photo 2 */}
            <div className="group relative aspect-[4/5] bg-muted/30 rounded-2xl overflow-hidden border border-border flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                <p className="font-medium">Healthy Meals</p>
              </div>
              <div className="text-center p-6">
                <Utensils className="w-16 h-16 text-muted-foreground/20 mx-auto" />
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-muted-foreground italic">
              "Discipline is doing what needs to be done, even if you don't want to do it."
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
