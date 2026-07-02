        // Message data for each client
        const messagesData = {
            sarah: {
                name: 'Sarah Johnson',
                project: 'Sunrise Tower',
                avatar: 'SJ',
                color: 'linear-gradient(135deg, #22C55E, #4ade80)',
                messages: [
                    { text: "Good morning John! I wanted to check on the progress of the Sunrise Tower.", sender: 'client', time: 'Today, 9:00 AM', status: 'read' },
                    { text: "Hi Sarah! The structural framework is progressing well. We're on track for July completion.", sender: 'me', time: 'Today, 9:15 AM', status: 'read' },
                    { text: "That's great news! Can you share any photos of the progress?", sender: 'client', time: 'Today, 9:30 AM', status: 'unread' },
                    { text: "Absolutely! I've uploaded site photos from this week to the Documents section. You can view them there.", sender: 'me', time: 'Today, 10:30 AM', status: 'read' }
                ]
            },
            michael: {
                name: 'Michael Brown',
                project: 'Metro Station',
                avatar: 'MB',
                color: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                messages: [
                    { text: "Hello John, when will the foundation work be completed?", sender: 'client', time: 'Yesterday, 2:00 PM', status: 'read' },
                    { text: "Hi Michael, foundation work is scheduled to be completed by June 25th. We're currently ahead of schedule.", sender: 'me', time: 'Yesterday, 2:30 PM', status: 'read' },
                    { text: "Perfect! Thank you for the quick response.", sender: 'client', time: 'Yesterday, 2:35 PM', status: 'read' }
                ]
            },
            emily: {
                name: 'Emily Davis',
                project: 'River Bridge',
                avatar: 'ED',
                color: 'linear-gradient(135deg, #a855f7, #c084fc)',
                messages: [
                    { text: "Thank you for the update on the bridge project. Looks great!", sender: 'client', time: 'Jun 09, 2026, 11:00 AM', status: 'read' },
                    { text: "You're welcome, Emily! We're making steady progress. Will keep you updated.", sender: 'me', time: 'Jun 09, 2026, 11:15 AM', status: 'read' }
                ]
            },
            robert: {
                name: 'Robert Wilson',
                project: 'Residential Complex',
                avatar: 'RW',
                color: 'linear-gradient(135deg, #F59E0B, #fbbf24)',
                messages: [
                    { text: "Hi John, I have a question about the budget. Can we schedule a call?", sender: 'client', time: 'Jun 08, 2026, 3:00 PM', status: 'read' },
                    { text: "Of course, Robert. I'm available tomorrow at 10 AM. Does that work for you?", sender: 'me', time: 'Jun 08, 2026, 3:30 PM', status: 'read' },
                    { text: "Yes, 10 AM works perfectly. I'll call you then.", sender: 'client', time: 'Jun 08, 2026, 3:35 PM', status: 'read' }
                ]
            }
        };
       
        let currentClient = 'sarah';
       
        function selectConversation(clientId) {
            currentClient = clientId;
           
            // Update active state in sidebar
            const items = document.querySelectorAll('.conversation-item');
            items.forEach(item => {
                item.classList.remove('active');
            });
            document.querySelector(`.conversation-item[data-client="${clientId}"]`).classList.add('active');
           
            // Update chat header
            const client = messagesData[clientId];
            document.getElementById('chatClientName').textContent = client.name;
            document.getElementById('chatAvatar').textContent = client.avatar;
            document.getElementById('chatAvatar').style.background = client.color;
           
            // Update messages
            renderMessages(clientId);
           
            // Clear unread badge for this conversation
            const unreadBadge = document.querySelector(`.conversation-item[data-client="${clientId}"] .unread-badge`);
            if (unreadBadge) {
                unreadBadge.style.display = 'none';
            }
           
            // Update notification dot count
            updateUnreadCount();
        }
       
        function renderMessages(clientId) {
            const client = messagesData[clientId];
            const messagesContainer = document.getElementById('chatMessages');
            messagesContainer.innerHTML = '';
           
            client.messages.forEach(msg => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message-bubble ${msg.sender === 'me' ? 'sent' : 'received'}`;
               
                let statusHtml = '';
                if (msg.sender === 'me' && msg.status === 'read') {
                    statusHtml = '<div class="message-status"><i class="bx bx-check-double"></i> Read</div>';
                } else if (msg.sender === 'me') {
                    statusHtml = '<div class="message-status"><i class="bx bx-check"></i> Delivered</div>';
                }
               
                messageDiv.innerHTML = `
                    <div>
                        <div class="bubble">${escapeHtml(msg.text)}</div>
                        <div class="message-time"> ${statusHtml} ${msg.time}</div>
                       
                    </div>
                `;
                messagesContainer.appendChild(messageDiv);
            });
           
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
       
        function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            if (message === '') return;
           
            // Add message to data
            const client = messagesData[currentClient];
            const now = new Date();
            const timeString = `Today, ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
           
            client.messages.push({
                text: message,
                sender: 'me',
                time: timeString,
                status: 'delivered'
            });
           
            // Re-render messages
            renderMessages(currentClient);
           
            // Clear input
            input.value = '';
           
            // Simulate reply after 2 seconds (for demo)
            setTimeout(() => {
                simulateReply(currentClient);
            }, 3000);
        }
       
        function simulateReply(clientId) {
            const replies = {
                sarah: "Thanks for the update, John! I really appreciate your quick response.",
                michael: "Great to hear! Please keep me posted on the progress.",
                emily: "Excellent work! When do you expect the next milestone?",
                robert: "Perfect. Looking forward to our call tomorrow!"
            };
           
            const client = messagesData[clientId];
            const replyText = replies[clientId] || "Thank you for the update!";
           
            client.messages.push({
                text: replyText,
                sender: 'client',
                time: 'Just now',
                status: 'delivered'
            });
           
            renderMessages(clientId);
           
            // Update unread badge if not in this conversation
            if (currentClient !== clientId) {
                const badge = document.querySelector(`.conversation-item[data-client="${clientId}"] .unread-badge`);
                if (badge) {
                    const currentCount = parseInt(badge.textContent) || 0;
                    badge.textContent = currentCount + 1;
                    badge.style.display = 'inline-block';
                }
            }
           
            updateUnreadCount();
        }
       
        function updateUnreadCount() {
            let totalUnread = 0;
            const badges = document.querySelectorAll('.conversation-item .unread-badge');
            badges.forEach(badge => {
                if (badge.style.display !== 'none') {
                    totalUnread += parseInt(badge.textContent) || 0;
                }
            });
           
            const notifyDot = document.querySelector('.notify-dot');
            if (notifyDot) {
                if (totalUnread > 0) {
                    notifyDot.style.display = 'block';
                } else {
                    notifyDot.style.display = 'none';
                }
            }
        }
       
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
       
        // Initialize with Sarah's conversation
        renderMessages('sarah');
        updateUnreadCount();
       
        // Enter key to send
        document.getElementById('messageInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });