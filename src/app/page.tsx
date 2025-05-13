"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Mail, FileText, Zap, ChevronRight, Star, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import ChatButton from "@/components/chat-button"
import Footer from "@/components/footer"
import FeatureAnimation from "@/components/feature-animation"
import HeroAnimation from "@/components/herp-animation"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0)
  const { scrollYProgress } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -300])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white overflow-hidden">
      {/* Floating Chat Button */}
      <ChatButton />

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-0 right-20 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000"></div>
        </div>

        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between min-h-[90vh] py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6 lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium mb-2">
                <Sparkles className="h-4 w-4 mr-1" /> Revolutionizing Workflows
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600">
                Prototype
              </h1>
              <p className="text-xl md:text-2xl font-medium text-gray-700">
                Intelligent email delivery & PDF summarization
              </p>
              <p className="text-gray-600 text-lg max-w-xl">
                Streamline your workflow with role-based email automation and instant PDF summarization powered by
                cutting-edge AI technology.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="border-purple-300 hover:bg-purple-50">
                  Watch Demo
                </Button>
              </motion.div>

              <div className="flex items-center justify-center lg:justify-start space-x-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full border-2 border-white bg-gradient-to-r ${
                        i === 1
                          ? "from-purple-400 to-purple-500"
                          : i === 2
                            ? "from-pink-400 to-pink-500"
                            : i === 3
                              ? "from-blue-400 to-blue-500"
                              : "from-green-400 to-green-500"
                      }`}
                    ></div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">1,000+</span> happy users
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="lg:w-1/2 relative"
              style={{ y: y1 }}
            >
              <HeroAnimation />
            </motion.div>
          </div>
        </div>

        {/* Curved divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-8">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Trusted by innovative companies
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
            {["Company A", "Company B", "Company C", "Company D", "Company E"].map((company, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                <div className="h-8 flex items-center justify-center">
                  <div
                    className={`bg-gradient-to-r ${
                      i % 5 === 0
                        ? "from-purple-400 to-purple-600"
                        : i % 5 === 1
                          ? "from-pink-400 to-pink-600"
                          : i % 5 === 2
                            ? "from-blue-400 to-blue-600"
                            : i % 5 === 3
                              ? "from-green-400 to-green-600"
                              : "from-yellow-400 to-yellow-600"
                    } bg-clip-text text-transparent font-bold text-xl`}
                  >
                    {company}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-50 rounded-full"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-50 rounded-full"></div>

        <div className="container px-4 md:px-6 mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: scrollY > 100 ? 1 : 0, y: scrollY > 100 ? 0 : 20 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4 mr-1" /> Powerful Features
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Designed for Productivity
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our intelligent tools enhance productivity and simplify complex tasks
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Mail className="h-6 w-6 text-white" />,
                title: "Role-Based Email",
                description:
                  "Automatically send targeted emails based on user roles and permissions. Ensure the right information reaches the right people.",
                color: "from-purple-500 to-purple-700",
                delay: 0,
              },
              {
                icon: <FileText className="h-6 w-6 text-white" />,
                title: "PDF Summarization",
                description:
                  "Extract key insights from lengthy documents in seconds. Our AI analyzes and condenses PDFs into concise, actionable summaries.",
                color: "from-pink-500 to-pink-700",
                delay: 0.1,
              },
              {
                icon: <Zap className="h-6 w-6 text-white" />,
                title: "Automation",
                description:
                  "Set up workflows that trigger actions automatically. Save time and reduce errors with intelligent process automation.",
                color: "from-violet-500 to-violet-700",
                delay: 0.2,
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: scrollY > 250 ? 1 : 0, y: scrollY > 250 ? 0 : 20 }}
                transition={{ duration: 0.5, delay: feature.delay }}
                className="group"
              >
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:-translate-y-2">
                  <CardContent className="p-6">
                    <div
                      className={`mb-6 rounded-2xl w-14 h-14 flex items-center justify-center bg-gradient-to-r ${feature.color} transform transition-transform group-hover:scale-110`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-purple-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                    <div className="mt-4 flex items-center text-purple-600 font-medium">
                      <span>Learn more</span>
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section className="py-20 bg-gradient-to-b from-white to-purple-50 relative overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: scrollY > 800 ? 1 : 0, x: scrollY > 800 ? 0 : -50 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4 mr-1" /> Smart Email Delivery
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Send the right emails to the right people</h2>
              <p className="text-lg text-gray-600 mb-8">
                Our intelligent role-based email system ensures that your team members receive exactly the information
                they need, when they need it.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "Automatic user role detection",
                  "Customizable email templates",
                  "Scheduled delivery options",
                  "Engagement analytics",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: scrollY > 850 ? 1 : 0, x: scrollY > 850 ? 0 : -20 }}
                    transition={{ duration: 0.4, delay: 0.1 * i }}
                    className="flex items-start"
                  >
                    <div className="mr-3 mt-1 bg-green-100 rounded-full p-1">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </motion.li>
                ))}
              </ul>

              <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
                Explore Email Features <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: scrollY > 800 ? 1 : 0, x: scrollY > 800 ? 0 : 50 }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2 relative"
            >
              <div className="relative bg-white p-2 rounded-2xl shadow-2xl">
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Smart Delivery
                </div>
                <FeatureAnimation type="email" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PDF Feature Section */}
      <section className="py-20 bg-purple-50 relative overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: scrollY > 1200 ? 1 : 0, x: scrollY > 1200 ? 0 : -50 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative bg-white p-2 rounded-2xl shadow-2xl">
                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  AI-Powered
                </div>
                <FeatureAnimation type="pdf" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: scrollY > 1200 ? 1 : 0, x: scrollY > 1200 ? 0 : 50 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4 mr-1" /> PDF Summarization
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Extract insights from any document instantly</h2>
              <p className="text-lg text-gray-600 mb-8">
                Our advanced AI analyzes and condenses lengthy PDFs into concise, actionable summaries, saving you hours
                of reading time.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "AI-powered content analysis",
                  "Key point extraction",
                  "Multiple summary lengths",
                  "Support for multiple languages",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: scrollY > 1250 ? 1 : 0, x: scrollY > 1250 ? 0 : 20 }}
                    transition={{ duration: 0.4, delay: 0.1 * i }}
                    className="flex items-start"
                  >
                    <div className="mr-3 mt-1 bg-green-100 rounded-full p-1">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </motion.li>
                ))}
              </ul>

              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                Try PDF Summarization <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-50 rounded-full"></div>
          <div className="absolute top-40 -left-20 w-60 h-60 bg-pink-50 rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-50 rounded-full"></div>
        </div>

        <div className="container px-4 md:px-6 mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: scrollY > 1600 ? 1 : 0, y: scrollY > 1600 ? 0 : 20 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4 mr-1" /> Simple Process
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes with our intuitive workflow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 -z-10"></div>

            {[
              {
                step: 1,
                title: "Configure",
                description: "Set up user roles and document processing preferences in our intuitive dashboard.",
                color: "from-purple-500 to-purple-700",
                delay: 0,
              },
              {
                step: 2,
                title: "Upload",
                description: "Upload PDFs or connect your email system through our secure API or user interface.",
                color: "from-pink-500 to-pink-700",
                delay: 0.1,
              },
              {
                step: 3,
                title: "Automate",
                description: "Let Prototype handle the rest - emails are sent and PDFs are summarized automatically.",
                color: "from-violet-500 to-violet-700",
                delay: 0.2,
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: scrollY > 1700 ? 1 : 0, y: scrollY > 1700 ? 0 : 20 }}
                transition={{ duration: 0.5, delay: step.delay }}
                className="relative"
              >
                <div className="bg-white rounded-lg p-8 shadow-lg relative z-10 border border-gray-100 hover:shadow-xl transition-shadow duration-300 h-full">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.color} text-white flex items-center justify-center font-bold text-lg mb-6`}
                  >
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-white to-purple-50">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: scrollY > 2000 ? 1 : 0, y: scrollY > 2000 ? 0 : 20 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium mb-4">
              <Star className="h-4 w-4 mr-1 fill-current" /> Testimonials
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied customers who have transformed their workflow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Prototype has revolutionized our document processing. We save hours each week with the PDF summarization feature.",
                name: "Sarah Johnson",
                title: "Marketing Director",
                avatar: "1",
                delay: 0,
              },
              {
                quote:
                  "The role-based email system ensures our team members get exactly the information they need. No more, no less.",
                name: "Michael Chen",
                title: "Operations Manager",
                avatar: "2",
                delay: 0.1,
              },
              {
                quote:
                  "Implementation was seamless. The automation capabilities have reduced our manual processing by 75%.",
                name: "Alex Rodriguez",
                title: "IT Director",
                avatar: "3",
                delay: 0.2,
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: scrollY > 2100 ? 1 : 0, y: scrollY > 2100 ? 0 : 20 }}
                transition={{ duration: 0.5, delay: testimonial.delay }}
                className="group"
              >
                <Card className="h-full border-none shadow-lg group-hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:-translate-y-2">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6 text-lg italic">"{testimonial.quote}"</p>
                    <div className="flex items-center">
                      <div
                        className={`w-12 h-12 rounded-full mr-4 bg-gradient-to-r ${
                          i % 3 === 0
                            ? "from-purple-400 to-purple-600"
                            : i % 3 === 1
                              ? "from-pink-400 to-pink-600"
                              : "from-blue-400 to-blue-600"
                        }`}
                      ></div>
                      <div>
                        <p className="font-bold text-gray-800">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-purple-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-purple-100 rounded-full opacity-50"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-pink-100 rounded-full opacity-50"></div>

        <div className="container px-4 md:px-6 mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: scrollY > 2400 ? 1 : 0, y: scrollY > 2400 ? 0 : 20 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4 mr-1" /> Pricing Plans
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Choose the plan that works best for your needs</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "$29",
                features: ["500 emails per month", "50 PDF summaries", "3 user roles", "Basic support"],
                color: "purple",
                popular: false,
                delay: 0,
              },
              {
                name: "Professional",
                price: "$79",
                features: [
                  "2,000 emails per month",
                  "200 PDF summaries",
                  "10 user roles",
                  "Priority support",
                  "Advanced analytics",
                ],
                color: "pink",
                popular: true,
                delay: 0.1,
              },
              {
                name: "Enterprise",
                price: "$199",
                features: [
                  "Unlimited emails",
                  "Unlimited PDF summaries",
                  "Custom user roles",
                  "24/7 dedicated support",
                  "Custom integrations",
                ],
                color: "violet",
                popular: false,
                delay: 0.2,
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: scrollY > 2500 ? 1 : 0, y: scrollY > 2500 ? 0 : 20 }}
                transition={{ duration: 0.5, delay: plan.delay }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 -translate-y-4 text-center z-10">
                    <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
                      Most Popular
                    </span>
                  </div>
                )}
                <Card
                  className={cn(
                    "h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-2",
                    plan.popular ? "border-t-4 border-t-pink-500 shadow-xl" : "",
                  )}
                >
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center">
                          <ChevronRight
                            className={`h-5 w-5 mr-2 ${
                              plan.color === "purple"
                                ? "text-purple-600"
                                : plan.color === "pink"
                                  ? "text-pink-600"
                                  : "text-violet-600"
                            }`}
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={cn(
                        "w-full",
                        plan.popular
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                          : "",
                      )}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white relative overflow-hidden">
        {/* Background animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-full">
              <path
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
                d="M0,0 Q50,50 100,0 V100 Q50,50 0,100 Z"
                className="animate-pulse"
              />
            </svg>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-full">
              <path
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="3"
                d="M0,20 Q50,70 100,20 V80 Q50,30 0,80 Z"
                className="animate-pulse animation-delay-2000"
              />
            </svg>
          </div>
        </div>

        <div className="container px-4 md:px-6 mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: scrollY > 2800 ? 1 : 0, y: scrollY > 2800 ? 0 : 20 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to transform your workflow?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses that use Prototype to streamline their operations and boost productivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 hover:text-purple-700">
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Schedule Demo
              </Button>
            </div>

            <div className="mt-12 pt-8 border-t border-white/20 text-center">
              <p className="text-white/80">No credit card required. 14-day free trial.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
