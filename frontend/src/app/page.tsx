"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { Code, FileText, Images, MessageCircleMore, Music, Video } from "lucide-react";
import { FaEnvelope, FaFacebook, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { MdContactSupport } from "react-icons/md";
import Lottie from "react-lottie-player";
import doctorAnimation from "../../public/lottie/doctor-ai.json";

const poppins = Poppins({
  weight: "600",
  subsets: ["latin"],
});

const HeroSection = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      {/* GitHub Icon */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-4">
        {/* Email Icon */}
        <Link href="mailto:phoenixrfta1614@gmail.com">
          <motion.div
            className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all group"
            whileHover={{ scale: 1.1 }}
          >
            <FaEnvelope
              className="text-white w-6 h-6 group-hover:text-gray-300 transition-colors"
              aria-label="Email for feedback"
            />
          </motion.div>
        </Link>

        {/* GitHub Icon */}
        <Link href="https://github.com/AbhinavMangalore16/Niramay" target="_blank">
          <motion.div
            className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all group"
            whileHover={{ scale: 1.1 }}
          >
            <FaGithub
              className="text-white w-6 h-6 group-hover:text-gray-300 transition-colors"
              aria-label="GitHub repository link"
            />
          </motion.div>
        </Link>
      </div>

      {/* Starfield background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-black via-indigo-900 to-black opacity-70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        />
      </div>

      {/* Hero Content */}
      <div className="z-10 text-center px-4 flex flex-col items-center">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Niramaya
        </motion.h1>
        <motion.h2
          className="mt-2 text-2xl md:text-4xl font-semibold"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Your AI Healthcare Assistant
        </motion.h2>
        <motion.p
          className="mt-4 text-sm md:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Your Intelligent Companion for a Healthier Future
        </motion.p>

        {/* Lottie Animation */}
        <div className="w-80 md:w-96 mt-6">
          <Lottie
            loop
            animationData={doctorAnimation}
            play
            className="w-full h-full"
          />
        </div>

        {/* Buttons */}
        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Link href="/api/auth/login">
            <motion.button
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-lg hover:bg-gradient-to-l hover:from-indigo-600 hover:to-purple-500 transition-all"
              whileHover={{ scale: 1.1 }}
            >
              Login
            </motion.button>
          </Link>
          <Link href="/api/auth/login">
            <motion.button
              className="ml-4 px-8 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-all"
              whileHover={{ scale: 1.1 }}
            >
              Sign Up
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
