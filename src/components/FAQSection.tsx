import React, { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';
import logoImage from '../assets/Logo.png';
import './FAQSection.css';

interface FAQ {
  question: string;
  answer: string;
}

type ChatMessage = {
  id: number;
  sender: 'reply' | 'user';
  text: string;
};

const FAQSection: React.FC = () => {
  const faqs: FAQ[] = [
    {
      question: "Sản phẩm này dành cho ai?",
      answer: "SEed dành cho tất cả sinh viên IT muốn rèn luyện kỹ năng phỏng vấn, từ các bạn mới bắt đầu đến những người đang chuẩn bị cho các vị trí Senior. Ngoài ra, đây cũng là nền tảng kết nối hiệu quả cho các nhà tuyển dụng tìm kiếm tài năng."
    },
    {
      question: "Các câu hỏi phỏng vấn có thực tế không?",
      answer: "Hoàn toàn thực tế. Ngân hàng câu hỏi của chúng tôi được tổng hợp từ các bộ câu hỏi phỏng vấn của các tập đoàn công nghệ lớn và được cập nhật liên tục bởi AI để bám sát xu hướng công nghệ mới nhất."
    },
    {
      question: "AI đánh giá dựa trên gì?",
      answer: "Hệ thống AI của SEed đánh giá dựa trên nhiều tiêu chí: độ chính xác về kiến thức chuyên môn, khả năng tư duy logic, kỹ năng trình bày, thái độ tự tin và cả tốc độ phản xạ của bạn."
    },
    {
      question: "Tìm việc như thế nào trên nền tảng này?",
      answer: "Sau khi hoàn thành các bài luyện tập, hồ sơ năng lực của bạn (được AI đánh giá) sẽ được hiển thị cho các nhà tuyển dụng phù hợp. Bạn cũng có thể chủ động ứng tuyển vào các vị trí được đăng tải trên SEed."
    },
    {
      question: "Tôi có thể luyện bao nhiêu lần?",
      answer: "Không giới hạn! Chúng tôi khuyến khích bạn luyện tập càng nhiều càng tốt để cải thiện kỹ năng và sự tự tin trước khi bước vào buổi phỏng vấn thực tế."
    }
  ];

  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      sender: 'reply',
      text: 'Xin chào!',
    },
  ]);
  const messageIdRef = useRef(1);
  const threadRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    threadRef.current?.scrollTo({
      top: threadRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const handleQuestionClick = (faq: FAQ, index: number) => {
    setActiveTab(index);
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: messageIdRef.current++,
        sender: 'user',
        text: faq.question,
      },
      {
        id: messageIdRef.current++,
        sender: 'reply',
        text: faq.answer,
      },
    ]);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <Reveal
          className="faq-header"
          delay={80}
        >
          <span className="faq-label">CÂU HỎI THƯỜNG GẶP</span>
          <h2 className="faq-title">Bạn có thắc mắc về...?</h2>
        </Reveal>

        <Reveal
          className="faq-mockup"
          delay={160}
          variant="scale"
        >
          <div className="mockup-window">
            <div className="mockup-header">
              <div className="header-controls">
                <span className="control close"></span>
                <span className="control minimize"></span>
                <span className="control maximize"></span>
              </div>
              <div className="header-title">Câu hỏi thường gặp</div>
              <div className="header-actions">
                <i className="ti ti-arrows-maximize"></i>
                <i className="ti ti-minus"></i>
                <i className="ti ti-x"></i>
              </div>
            </div>

            <div className="mockup-body">
              <div className="chat-thread" ref={threadRef} aria-live="polite">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`chat-bubble ${message.sender === 'user' ? 'user-message' : 'reply-message'}`}
                  >
                    {message.sender === 'reply' && (
                      <div className="reply-avatar">
                        <img src={logoImage} alt="" aria-hidden="true" />
                      </div>
                    )}
                    <div className="message-content">
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="question-selectors">
                <p className="selection-label">Chọn câu hỏi bạn quan tâm:</p>
                <div className="question-grid">
                  {faqs.map((faq, index) => (
                    <button 
                      key={index} 
                      className={`question-tag ${activeTab === index ? 'active' : ''}`}
                      onClick={() => handleQuestionClick(faq, index)}
                    >
                      {faq.question}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mockup-footer">
               <i className="ti ti-message-dots"></i>
               Chọn một câu hỏi để bắt đầu trò chuyện
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default FAQSection;
