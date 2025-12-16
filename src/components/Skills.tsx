"use client"

import { motion } from "framer-motion"
import { Cloud, Shield, Brain, Workflow, Terminal } from "lucide-react"

const skills = [
  {
    category: "Cloud Computing",
    icon: Cloud,
    color: "text-primary",
    items: ["AWS (EC2, RDS, S3)", "Auto Scaling", "Oracle Cloud ERP", "EILM", "Cloud Architecture"],
  },
  {
    category: "Cybersecurity",
    icon: Shield,
    color: "text-secondary",
    items: ["Secure Coding", "Policy Compliance", "Access Control", "Identity Management", "Security Auditing"],
  },
  {
    category: "AI & Data",
    icon: Brain,
    color: "text-accent",
    items: ["LLM Integration", "AI-Driven Reporting", "Python", "Power BI", "Data Analytics"],
  },
  {
    category: "Automation & DevOps",
    icon: Workflow,
    color: "text-blue-400",
    items: ["n8n Workflows", "GitHub Actions", "CI/CD Pipelines", "API Integration", "Infrastructure as Code"],
  },
  {
    category: "Systems & Tools",
    icon: Terminal,
    color: "text-green-400",
    items: ["Linux CLI", "System Automation", "Git/GitHub", "Docker", "Agile/Scrum"],
  },
]

export function Skills() {
  return (
    <section id="skills" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Technical Skills</h2>
          <div className="h-1 w-20 bg-secondary mx-auto rounded-full" />
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            A comprehensive toolkit for building secure, intelligent, and scalable cloud solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow hover:border-primary/50 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-lg bg-background border border-border group-hover:scale-110 transition-transform ${skill.color}`}>
                  <skill.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg">{skill.category}</h3>
              </div>
              <ul className="space-y-2">
                {skill.items.map((item) => (
                  <li key={item} className="flex items-center text-muted-foreground text-sm">
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 bg-current ${skill.color}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
