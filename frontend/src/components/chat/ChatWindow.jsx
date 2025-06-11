
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Send,
  Image as ImageIcon,
  Smile,
  Paperclip,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Picker } from "emoji-mart";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { chatService, subscribeToChatMessages } from "@/lib/supabase";

function ChatWindow({ onClose }) {
  // ... (rest of the existing imports and initial state)

  useEffect(() => {
    // Subscribe to real-time chat updates
    const unsubscribe = subscribeToChatMessages((payload) => {
      if (payload.eventType === 'INSERT') {
        const newMessage = payload.new;
        if (selectedUser && 
            ((newMessage.sender === "current_user" && newMessage.receiver === selectedUser.id) ||
             (newMessage.sender === selectedUser.id && newMessage.receiver === "current_user"))) {
          setMessages(prev => [...prev, newMessage]);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [selectedUser]);

  const sendMessage = async (text = newMessage, attachment = null) => {
    if ((!text && !attachment) || !selectedUser) return;

    try {
      const message = {
        text,
        sender: "current_user",
        receiver: selectedUser.id,
        attachment,
        created_at: new Date().toISOString()
      };

      await chatService.sendMessage(message);
      setNewMessage("");
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive"
      });
    }
  };

  // ... (rest of the existing component code)
}

export default ChatWindow;
