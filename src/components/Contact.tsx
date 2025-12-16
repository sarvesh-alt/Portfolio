"use client"

import { motion } from "framer-motion"
import { Mail, Linkedin, Github, MapPin } from "lucide-react"
import Link from "next/link"

export function Contact() {
  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Get In Touch</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Interested in collaborating or hiring? Feel free to reach out.
          </p>
        </motion.div>

        <div className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl"
          >
            <div className="flex items-center gap-4 p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Email</h3>
                <a href="mailto:sarveshmore27@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                  sarveshmore27@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
                <Linkedin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">LinkedIn</h3>
                <Link href="https://www.linkedin.com/in/sarveshmore28" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                  linkedin.com/in/sarveshmore28
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-accent/10 rounded-lg text-accent">
                <Github className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">GitHub</h3>
                <Link href="https://github.com/sarvesh-alt" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                  github.com/sarvesh-alt
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-foreground/10 rounded-lg text-foreground">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Location</h3>
                <p className="text-muted-foreground">Toronto, Canada / Mumbai, India</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
