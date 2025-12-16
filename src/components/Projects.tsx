"use client"

import { motion } from "framer-motion"
import { Github, ExternalLink, Server, GitBranch } from "lucide-react"
import Link from "next/link"

const projects = [
  {
    title: "Scalable Web Application on AWS",
    description: "Designed and deployed a highly available web application using AWS EC2, RDS, and Auto Scaling groups. Implemented load balancing to handle traffic spikes and ensured data persistence with automated backups.",
    tags: ["AWS EC2", "RDS", "Auto Scaling", "Load Balancing"],
    icon: Server,
    links: {
      github: "#", // Placeholder
      demo: "#",   // Placeholder
    },
  },
  {
    title: "CI/CD Pipeline with GitHub Actions",
    description: "Built a robust CI/CD pipeline using GitHub Actions with OpenID Connect authentication for secure deployments. Automated testing, building, and deployment processes to reduce manual errors and accelerate release cycles.",
    tags: ["GitHub Actions", "CI/CD", "OIDC", "DevOps"],
    icon: GitBranch,
    links: {
      github: "#", // Placeholder
      demo: "#",   // Placeholder
    },
  },
]

export function Projects() {
  return (
    <section id="projects" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Featured Projects</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Showcasing my expertise in cloud architecture, automation, and secure development.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="group relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    <project.icon className="h-6 w-6" />
                  </div>
                  <div className="flex gap-4">
                    <Link href={project.links.github} className="text-muted-foreground hover:text-foreground transition-colors">
                      <Github className="h-5 w-5" />
                    </Link>
                    <Link href={project.links.demo} className="text-muted-foreground hover:text-foreground transition-colors">
                      <ExternalLink className="h-5 w-5" />
                    </Link>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-secondary/10 text-secondary border border-secondary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
