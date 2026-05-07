import React from 'react';
import Reveal from './Reveal';

const TestimonialsSection: React.FC = () => (
  <section className="py-24 bg-gradient-to-b from-[#E484EB]/10 to-white/50 overflow-hidden w-full min-h-full flex flex-col justify-center">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal
        className="flex flex-col items-center text-center mb-16 relative"
        delay={80}
      >
        <div className="px-5 py-2.5 rounded-full bg-[#DA498D]/30 shadow-[0_4px_3px_0_rgba(33,28,132,0.25)] mb-6">
          <span className="text-[#372AA5] text-sm font-medium">Đánh giá</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
          <span className="text-[#101828]">Được yêu thích bởi </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4D55CC] via-[#6D52E5] to-[#8B4CFF]">
            Sinh viên & Nhà tuyển dụng
          </span>
        </h2>
        <p className="text-[#4A5565] text-xl max-w-2xl mx-auto">
          Xem cộng đồng của chúng tôi nói gì về trải nghiệm của họ
        </p>
      </Reveal>

      <div
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          {
            quote: 'Luyện phỏng vấn với AI đã giúp mình nhận được công việc mơ ước tại một công ty công nghệ hàng đầu. Phản hồi cực kỳ chi tiết và hữu ích!',
            author: 'Nguyễn Minh Anh',
            role: 'Sinh viên CNTT, UIT',
            emoji: '👨‍💻',
            bg: '#372AA5'
          },
          {
            quote: 'Mình đã luyện hơn 20 buổi phỏng vấn thử trước khi đi phỏng vấn thật. Các câu hỏi AI đưa ra rất sát với thực tế và chuẩn bị hoàn hảo.',
            author: 'Trần Thanh Hà',
            role: 'Tốt nghiệp KHMT, HCMUS',
            emoji: '👩‍💻',
            bg: '#372AA5'
          },
          {
            quote: 'Trong con người tôi không thể tha thứ được cho bố tôi, tại vì việc làm của bố tôi là không thể chấp nhận được',
            author: 'Phùng Thanh Độ',
            role: 'Streamer người tày',
            emoji: '👔',
            bg: '#372AA5'
          },
          {
            quote: 'Phản hồi theo thời gian thực trong quá trình phỏng vấn giúp mình tự tự tin hơn rất nhiều. Mình có thể thấy ngay điểm cần cải thiện.',
            author: 'Phạm Thu Trang',
            role: 'Kỹ sư phần mềm',
            emoji: '👩‍🎓',
            bg: '#372AA5'
          }
        ].map((item, idx) => (
          <Reveal
            key={idx}
            className="bg-white p-6 rounded-2xl border border-[#F3F4F6] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] flex flex-col justify-between min-h-[285px] hover:shadow-lg transition-shadow"
            delay={140 + idx * 60}
          >
            <div>
              <div className="mb-4">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.3262 3.99878C20.6192 3.99878 19.9411 4.27964 19.4412 4.77957C18.9413 5.2795 18.6604 5.95755 18.6604 6.66455V14.6619C18.6604 15.3689 18.9413 16.0469 19.4412 16.5469C19.9411 17.0468 20.6192 17.3277 21.3262 17.3277C21.6797 17.3277 22.0187 17.4681 22.2687 17.718C22.5187 17.968 22.6591 18.307 22.6591 18.6605V19.9934C22.6591 20.7004 22.3782 21.3785 21.8783 21.8784C21.3784 22.3783 20.7003 22.6592 19.9933 22.6592C19.6398 22.6592 19.3008 22.7996 19.0508 23.0496C18.8009 23.2996 18.6604 23.6386 18.6604 23.9921V26.6579C18.6604 27.0114 18.8009 27.3504 19.0508 27.6004C19.3008 27.8503 19.6398 27.9908 19.9933 27.9908C22.1143 27.9908 24.1485 27.1482 25.6483 25.6484C27.1481 24.1486 27.9906 22.1145 27.9906 19.9934V6.66455C27.9906 5.95755 27.7098 5.2795 27.2099 4.77957C26.7099 4.27964 26.0319 3.99878 25.3249 3.99878H21.3262Z" stroke="#4D55CC" strokeOpacity="0.5" strokeWidth="2.66578" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6.66443 3.99878C5.95742 3.99878 5.27937 4.27964 4.77944 4.77957C4.27951 5.2795 3.99866 5.95755 3.99866 6.66455V14.6619C3.99866 15.3689 4.27951 16.0469 4.77944 16.5469C5.27937 17.0468 5.95742 17.3277 6.66443 17.3277C7.01794 17.3277 7.35696 17.4681 7.60693 17.718C7.85689 17.968 7.99732 18.307 7.99732 18.6605V19.9934C7.99732 20.7004 7.71646 21.3785 7.21653 21.8784C6.7166 22.3783 6.03855 22.6592 5.33154 22.6592C4.97804 22.6592 4.63902 22.7996 4.38905 23.0496C4.13909 23.2996 3.99866 23.6386 3.99866 23.9921V26.6579C3.99866 27.0114 4.13909 27.3504 4.38905 27.6004C4.63902 27.8503 4.97804 27.9908 5.33154 27.9908C7.45257 27.9908 9.48672 27.1482 10.9865 25.6484C12.4863 24.1486 13.3289 22.1145 13.3289 19.9934V6.66455C13.3289 5.95755 13.048 5.2795 12.5481 4.77957C12.0482 4.27964 11.3701 3.99878 10.6631 3.99878H6.66443Z" stroke="#4D55CC" strokeOpacity="0.5" strokeWidth="2.66578" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.68079 1.52954C7.71 1.47053 7.75511 1.42086 7.81105 1.38614C7.86699 1.35141 7.93151 1.33301 7.99735 1.33301C8.06319 1.33301 8.12772 1.35141 8.18366 1.38614C8.23959 1.42086 8.28471 1.47053 8.31392 1.52954L9.8534 4.64784C9.95482 4.85308 10.1045 5.03065 10.2897 5.1653C10.4748 5.29995 10.6899 5.38767 10.9164 5.42092L14.3592 5.92475C14.4245 5.9342 14.4858 5.96172 14.5362 6.00419C14.5866 6.04666 14.6241 6.10239 14.6445 6.16507C14.6649 6.22776 14.6673 6.2949 14.6515 6.3589C14.6358 6.42289 14.6024 6.4812 14.5552 6.52722L12.0653 8.95175C11.9011 9.11176 11.7783 9.30928 11.7073 9.52731C11.6364 9.74533 11.6195 9.97733 11.6581 10.2033L12.2459 13.6289C12.2575 13.6941 12.2504 13.7612 12.2256 13.8226C12.2008 13.884 12.1593 13.9372 12.1057 13.9761C12.0521 14.015 11.9887 14.0381 11.9226 14.0427C11.8566 14.0473 11.7906 14.0332 11.7321 14.0021L8.65447 12.3839C8.45168 12.2775 8.22606 12.2218 7.99702 12.2218C7.76798 12.2218 7.54236 12.2775 7.33957 12.3839L4.26259 14.0021C4.20416 14.033 4.1382 14.0469 4.07229 14.0422C4.00635 14.0375 3.94301 14.0144 3.88958 13.9756C3.83611 13.9367 3.79463 13.8836 3.76986 13.8223C3.74508 13.761 3.738 13.694 3.74943 13.6289L4.33657 10.204C4.37532 9.97789 4.35852 9.74575 4.28761 9.52759C4.21667 9.30942 4.09372 9.1118 3.92937 8.95175L1.43953 6.52788C1.39194 6.48192 1.35822 6.42351 1.3422 6.35932C1.32618 6.29513 1.32852 6.22773 1.34894 6.1648C1.36936 6.10187 1.40705 6.04594 1.4577 6.00338C1.50836 5.96082 1.56995 5.93334 1.63546 5.92408L5.07762 5.42092C5.30439 5.38793 5.51974 5.30033 5.70514 5.16566C5.89054 5.03099 6.04044 4.85328 6.14194 4.64784L7.68076 1.52954Z" fill="#DA498D" stroke="#DA498D" strokeWidth="1.33289" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ))}
              </div>

              <p className="text-[#4A5565] text-sm leading-[1.625] mb-6">"{item.quote}"</p>
            </div>

            <div className="flex items-center gap-3 mt-auto">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xl" style={{ backgroundColor: item.bg }}>
                {item.emoji}
              </div>
              <div className="flex flex-col">
                <span className="text-[#101828] text-sm font-semibold">{item.author}</span>
                <span className="text-[#6A7282] text-[12px]">{item.role}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
