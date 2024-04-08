import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: reciverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, reciverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, reciverId]
            });
        }

        const newMessage = new Message({
            senderId,
            reciverId,
            message
        });

        if (newMessage)
            conversation.messages.push(newMessage);

        // await conversation.save();
        // await newMessage.save();

        // this will run in parallel
        await Promise.all([conversation.save(), newMessage.save()]);


        // SOCKET IO FUNCTIONALITY WILL GO HERE
        const reciverSocketId = getReceiverSocketId(reciverId);
        if (reciverSocketId) {
            // io.to(<socket_id>).emit() used to send event to specific client
            io.to(reciverSocketId).emit("newMessage", newMessage);
        }


        res.status(201).json(newMessage);

    } catch (error) {

        console.log("Error in sendMessage controller : ", error.message);
        res.status(500).json({
            error: "Internal server error"
        });

    }


};


export const getMessages = async (req, res) => {

    try {

        const { id: userToChatId } = req.params;
        const sernderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [sernderId, userToChatId] }
        }).populate("messages");

        if (!conversation) return res.status(200).json([]);

        res.status(200).json(conversation.messages);




    } catch (error) {

        console.log("Error in sendMessage controller : ", error.message);
        res.status(500).json({
            error: "Internal server error"
        });

    }

};