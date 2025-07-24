import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    FlatList, 
    TouchableOpacity, 
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendChatMessage, getMessagesForForm } from '../../services/chatService';
import { COLORS, FONTS, SIZES, SHADOWS, SPACING } from '../../utils/theme';

const Chat = ({ route, navigation }) => {
    const { formId, doctorId } = route.params;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    
    // Load user data and messages
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const id = await AsyncStorage.getItem('userId');
                const role = await AsyncStorage.getItem('userRole');
                
                console.log('AsyncStorage userId:', id);
                console.log('AsyncStorage userRole:', role);
                
                if (id && role) {
                    const parsedId = parseInt(id);
                    console.log('Parsed userId:', parsedId);
                    setUserId(parsedId);
                    setUserRole(role);
                } else {
                    console.error('Missing userId or userRole in AsyncStorage');
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        };
        
        const loadMessages = async () => {
            try {
                setLoading(true);
                const data = await getMessagesForForm(formId);
                setMessages(data);
            } catch (error) {
                console.error('Error loading messages:', error);
                Alert.alert('Erreur', 'Impossible de charger les messages.');
            } finally {
                setLoading(false);
            }
        };
        
        loadUserData();
        loadMessages();
        
        // Set up polling for new messages every 10 seconds
        const interval = setInterval(() => {
            loadMessages();
        }, 10000);
        
        return () => clearInterval(interval);
    }, [formId]);

    const handleSend = async () => {
        if (!message.trim() || !userId) {
            console.log('Cannot send: empty message or missing userId', { message: message.trim(), userId });
            return;
        }

        const trimmedMessage = message.trim();
        setMessage('');

        try {
            console.log('Sending message with data:', { formId, doctorId, userId });
            
            // Send message to backend
            const messageData = {
                formId: formId,
                receiverId: doctorId || null,  // Explicitly set to null if undefined
                message: trimmedMessage,
                content: trimmedMessage,
                messageType: 'TEXT',
                timestamp: new Date().toISOString()
            };
            
            console.log('Message data:', messageData);
            const response = await sendChatMessage(messageData);
            console.log('Send message response:', response);
            
            // Refresh messages
            const updatedMessages = await getMessagesForForm(formId);
            console.log('Updated messages:', updatedMessages);
            setMessages(updatedMessages);
        } catch (error) {
            console.error('Error sending message:', error);
            Alert.alert('Erreur', 'Impossible d\'envoyer le message. Veuillez réessayer.');
        }
    };

    const renderMessage = ({ item }) => {
        // Check if the message is from the current user
        const isCurrentUser = item.senderId === userId;
        const isNeurologue = item.senderRole === 'NEUROLOGUE';
        
        return (
            <View style={[
                styles.messageBubble,
                isCurrentUser ? styles.neurologueMessage : styles.doctorMessage
            ]}>
                <Text style={styles.senderName}>{item.senderName}</Text>
                <Text style={styles.messageText}>{item.message || item.content}</Text>
                <Text style={styles.timestamp}>
                    {new Date(item.timestamp || item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={80}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Chat - Formulaire #{formId}</Text>
            </View>
            
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Chargement des messages...</Text>
                </View>
            ) : messages.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Aucun message. Commencez la conversation!</Text>
                </View>
            ) : (
                <FlatList
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.messageId.toString()}
                    style={styles.messageList}
                    contentContainerStyle={styles.messageListContent}
                    inverted={false}
                />
            )}
            
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Tapez votre message..."
                    multiline
                    maxLength={500}
                />
                <TouchableOpacity 
                    style={[
                        styles.sendButton,
                        !message.trim() && styles.sendButtonDisabled
                    ]}
                    onPress={handleSend}
                    disabled={!message.trim()}
                >
                    <Text style={styles.sendButtonText}>Envoyer</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGrey,
    },
    header: {
        padding: SPACING.m,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        ...SHADOWS.small,
    },
    headerTitle: {
        color: COLORS.light,
        fontSize: SIZES.large,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: SPACING.m,
        fontSize: SIZES.medium,
        color: COLORS.grey,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.l,
    },
    emptyText: {
        fontSize: SIZES.medium,
        color: COLORS.grey,
        textAlign: 'center',
    },
    messageList: {
        flex: 1,
    },
    messageListContent: {
        padding: SPACING.m,
        paddingBottom: SPACING.xl,
    },
    messageBubble: {
        padding: SPACING.m,
        borderRadius: 16,
        marginBottom: SPACING.s,
        maxWidth: '80%',
        ...SHADOWS.small,
    },
    neurologueMessage: {
        backgroundColor: '#E3F2FD', // Light blue for neurologist
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    doctorMessage: {
        backgroundColor: COLORS.light,
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
    },
    senderName: {
        fontSize: SIZES.small,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 4,
    },
    messageText: {
        fontSize: SIZES.medium,
        color: COLORS.dark,
    },
    timestamp: {
        fontSize: SIZES.small,
        color: COLORS.grey,
        alignSelf: 'flex-end',
        marginTop: SPACING.xs,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: SPACING.m,
        backgroundColor: COLORS.light,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        marginBottom: 20, // Add more margin from the bottom
        ...SHADOWS.medium,
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.lightGrey,
        borderRadius: 20,
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
        maxHeight: 100,
        fontSize: SIZES.medium,
    },
    sendButton: {
        marginLeft: SPACING.s,
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        paddingHorizontal: SPACING.l,
        justifyContent: 'center',
        ...SHADOWS.small,
    },
    sendButtonDisabled: {
        backgroundColor: COLORS.grey,
    },
    sendButtonText: {
        color: COLORS.light,
        fontWeight: 'bold',
        fontSize: SIZES.medium,
    },
});

export default Chat;