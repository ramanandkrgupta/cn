import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BookOpen, Mail, Phone, MapPin, 
  MessageCircle, Send, ChevronRight, Heart,
  Youtube, Linkedin, MessageSquare, Instagram
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-base-100 to-base-200 border-t border-base-300">
      {/* Join Community Section */}
      <div className="bg-primary/5 w-full">
        <motion.div 
          className="max-w-7xl mx-auto px-4 py-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="bg-base-100 rounded-xl p-8 shadow-lg max-w-3xl mx-auto"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Join Our Student Community
            </h3>
            <p className="text-base-content/70 mb-6">
              Get instant updates and connect with fellow students
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href="https://chat.whatsapp.com/JotgzAmp62YLOwQScP29iD"
                className="btn btn-success gap-2 flex-1 sm:flex-initial"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageSquare className="w-5 h-5" />
                Join WhatsApp Group
              </motion.a>
              <motion.a
                href="https://chat.whatsapp.com/JotgzAmp62YLOwQScP29iD"
                className="btn btn-primary gap-2 flex-1 sm:flex-initial"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-5 h-5" />
                Join Telegram
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Main Footer Content */}
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About Section */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">NotesMates</h3>
              </div>
              <p className="text-base-content/70 text-sm leading-relaxed">
                Your one-stop platform for quality study materials, notes, and collaborative learning.
              </p>
              <div className="flex gap-3 pt-2">
                {[
                  { icon: MessageSquare, href: "#", color: "text-green-500" },
                  { icon: Youtube, href: "#", color: "text-red-500" },
                  { icon: Instagram, href: "#", color: "text-pink-500" },
                  { icon: Linkedin, href: "#", color: "text-blue-500" }
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    className={`${social.color} hover:opacity-80 transition-opacity`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold">Study Resources</h3>
              <ul className="space-y-2">
                {[
                  { name: 'Latest Notes', href: '/notes' },
                  { name: 'Question Papers', href: '/papers' },
                  { name: 'Video Lectures', href: '/lectures' },
                  { name: 'Study Groups', href: '/groups' }
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    className="flex items-center gap-2 group"
                    whileHover={{ x: 5 }}
                  >
                    <ChevronRight className="w-4 h-4 text-primary" />
                    <Link 
                      href={item.href}
                      className="text-base-content/70 group-hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold">Support</h3>
              <ul className="space-y-2">
                {[
                  { name: 'Help Center', href: '/help' },
                  { name: 'Terms of Use', href: '/terms' },
                  { name: 'Privacy Policy', href: '/privacy' },
                  { name: 'Refund Policy', href: '/refund' }
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    className="flex items-center gap-2 group"
                    whileHover={{ x: 5 }}
                  >
                    <ChevronRight className="w-4 h-4 text-primary" />
                    <Link 
                      href={item.href}
                      className="text-base-content/70 group-hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold">Get in Touch</h3>
              <div className="space-y-4">
                <motion.a
                  href="https://wa.me/your-number"
                  className="flex items-center gap-3 p-3 rounded-lg bg-success/10 hover:bg-success/20 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <MessageSquare className="w-5 h-5 text-success" />
                  <div>
                    <p className="font-medium text-success">WhatsApp Support</p>
                    <p className="text-base-content/70 text-sm">Quick Response</p>
                  </div>
                </motion.a>
                <motion.a
                  href="mailto:support@collegenotes.tech"
                  className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-primary">Email Support</p>
                    <p className="text-base-content/70 text-sm">support@collegenotes.tech</p>
                  </div>
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div 
            className="mt-12 pt-6 border-t border-base-content/10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-base-content/60 text-sm text-center sm:text-left">
                © {new Date().getFullYear()} CollegeNotes. All rights reserved.
              </p>
              <div className="flex items-center gap-1 text-sm text-base-content/60">
                Made with <Heart className="w-4 h-4 text-red-500" /> in India
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
} 