import { useEffect, useRef } from 'react'; 
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import './Feedback.scss';


type FeedbackFormData = {
  name: string;
  email: string;
  contact: string;
  subject: string;
  message: string;
};

const Feedback = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FeedbackFormData>();
  const cardRef = useRef<HTMLDivElement>(null); 

  const onSubmit: SubmitHandler<FeedbackFormData> = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    reset(); 
  };


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible"); 
            observer.unobserve(entry.target); 
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2, 
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div className="feedback-container-wrapper">
      <div className="feedback-container">
        <div className="feedback-div">
          <div ref={cardRef} className="feedback-form-card"> 
            <h3 id="card-title">Your opinion is important to us</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="feedback-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  {...register("name", { required: "Name is required" })}
                  className={errors.name ? "error" : ""}
                  disabled={isSubmitting}
                />
                {errors.name && <span className="error-message">{errors.name.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Your Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  className={errors.email ? "error" : ""}
                  disabled={isSubmitting}
                />
                {errors.email && <span className="error-message">{errors.email.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="contact">Contact Number</label>
                <input
                  id="contact"
                  type="tel"
                  placeholder="Your Contact Number"
                  {...register("contact", {
                    required: "Contact number is required",
                    pattern: {
                      value: /^[0-9+\-\s()]+$/,
                      message: "Please enter a valid phone number",
                    },
                  })}
                  className={errors.contact ? "error" : ""}
                  disabled={isSubmitting}
                />
                {errors.contact && <span className="error-message">{errors.contact.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  type="text"
                  placeholder="Subject of your feedback"
                  {...register("subject", { required: "Subject is required" })}
                  className={errors.subject ? "error" : ""}
                  disabled={isSubmitting}
                />
                {errors.subject && <span className="error-message">{errors.subject.message}</span>}
              </div>

              <div className="form-group full-width">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  placeholder="Explain your opinion please..."
                  rows={6}
                  {...register("message", {
                    required: "Message is required",
                    minLength: { value: 10, message: "Message must be at least 10 characters" },
                  })}
                  className={errors.message ? "error" : ""}
                  disabled={isSubmitting}
                ></textarea>
                {errors.message && <span className="error-message">{errors.message.message}</span>}
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;