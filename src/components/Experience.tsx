"use client"

import { motion } from "framer-motion"
import { Briefcase, Calendar } from "lucide-react"

const experiences = [
  {
    title: "Intern",
    company: "Trinamix Inc., Canada",
    period: "May 2025 – Aug 2025",
    description: [
      "Built AI-powered analytics on Oracle Cloud ERP, improving reporting speed by 30% and forecast accuracy by 25%.",
      "Automated guided SaaS configuration using n8n workflows, reducing setup time by 40%.",
      "Integrated LLM-based insights to streamline ERP data analysis, cutting manual effort by 35%.",
      "Documented cloud architecture and AI deployment best practices.",
    ],
  },
  {
    title: "Full Stack Developer",
    company: "Aurion Pro Solutions, India",
    period: "Jan 2022 – Apr 2024",
    description: [
      "Developed and deployed secure financial applications, ensuring compliance with Information Security Policies.",
      "Optimized database performance by 40% through query tuning and indexing.",
      "Implemented API-based automation and worked extensively with Linux CLI.",
      "Collaborated in Agile sprint cycles to deliver high-quality software features.",
    ],
  },
]

export function Experience() {
  return (
    <section id="experience" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Professional Experience</h2>
          <div className="h-1 w-20 bg-accent mx-auto rounded-full" />
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 h-full w-0.5 bg-border" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`relative flex flex-col md:flex-row ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Dot */}
                <div className="absolute left-[-5px] md:left-1/2 md:-translate-x-[5px] top-0 w-3 h-3 rounded-full bg-primary ring-4 ring-background z-10" />

                {/* Content */}
                <div className={`ml-6 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pl-12" : "md:pr-12"}`}>
                  <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-foreground">{exp.title}</h3>
                      <Briefcase className="h-4 w-4 text-muted-foreground md:hidden" />
                    </div>
                    <div className="text-primary font-medium mb-2">{exp.company}</div>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Calendar className="h-4 w-4 mr-2" />
                      {exp.period}
                    </div>
                    <ul className="space-y-2">
                      {exp.description.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start">
                          <span className="mr-2 mt-1.5 w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
