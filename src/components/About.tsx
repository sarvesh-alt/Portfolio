"use client"

import { motion } from "framer-motion"
import { User, Server, Shield, Cpu } from "lucide-react"

export function About() {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">About Me</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              I am a <span className="text-foreground font-semibold">Cybersecurity & Cloud Engineer</span> with a strong foundation in full-stack development. 
              Currently pursuing a postgraduate certificate in Cloud Computing, I specialize in building secure, scalable systems and automating complex workflows.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              My journey bridges the gap between <span className="text-primary">Cloud Infrastructure</span>, <span className="text-secondary">AI-driven Analytics</span>, and <span className="text-accent">Cybersecurity</span>. 
              I have hands-on experience optimizing Oracle Cloud ERP systems, deploying AWS architectures, and implementing secure coding practices in financial applications.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Server className="h-6 w-6" />
                </div>
                <span className="font-medium">Cloud Native</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                  <Shield className="h-6 w-6" />
                </div>
                <span className="font-medium">Security First</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg text-accent">
                  <Cpu className="h-6 w-6" />
                </div>
                <span className="font-medium">AI Integration</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-foreground/10 rounded-lg text-foreground">
                  <User className="h-6 w-6" />
                </div>
                <span className="font-medium">User Centric</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-2xl p-8">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
              <h3 className="text-xl font-bold mb-4">Education</h3>
              <div className="space-y-6">
                <div className="relative pl-6 border-l-2 border-primary/30">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary" />
                  <h4 className="font-semibold">Postgraduate Diploma, Cyber/Computer Forensics and Counterterrorism</h4>
                  <p className="text-sm text-muted-foreground">Durham College (Sep 2025 - May 2026)</p>
                </div>
                <div className="relative pl-6 border-l-2 border-secondary/30">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-secondary" />
                  <h4 className="font-semibold">Postgraduate Diploma, Cloud Computing</h4>
                  <p className="text-sm text-muted-foreground">Durham College (Sep 2024 - Aug 2025)</p>
                  <p className="text-xs text-muted-foreground mt-1">Skills: AWS Lambda, Amazon Web Services (AWS), Amazon CloudWatch, Cloud Computing</p>
                </div>
                <div className="relative pl-6 border-l-2 border-accent/30">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-accent" />
                  <h4 className="font-semibold">Master of Computer Applications - MCA</h4>
                  <p className="text-sm text-muted-foreground">K J Somaiya Institute of Management (2019 - 2022)</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
