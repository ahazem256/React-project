import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./quiz.css";

const PlantQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({ space: "", care: "", category: "" });
  const [results, setResults] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:5005/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setIsLoading(false);
      });
  }, []);

  const quizQuestions = [
    { 
      question: "What's your plant space like?", 
      key: "space",
      description: "Help us find plants that fit perfectly in your space"
    },
    { 
      question: "How's your plant care routine?", 
      key: "care",
      description: "Choose based on your availability and experience"
    },
    { 
      question: "Where will your green friends live?", 
      key: "category",
      description: "Let's find the perfect spot for your plants"
    }
  ];

  // استخدام صور النباتات من البورت
  const getPlantImagesFromPort = () => {
    if (products.length === 0) return [];
    
    const plantImages = products.map(product => product.image).filter(Boolean);
    return plantImages.length > 0 ? plantImages : [
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ];
  };

  const plantImages = getPlantImagesFromPort();

  const getOptionsForQuestion = (key: string) => {
    const spaceImages = plantImages.slice(0, 2);
    const careImages = plantImages.slice(2, 4);
    const categoryImages = plantImages.slice(4, 6);

    switch (key) {
      case "space":
        return [
          { 
            label: "Spacious Room", 
            value: "large", 
            icon: "🪴",
            image: spaceImages[0] || "/api/placeholder/400/300",
            description: "Large floor plants, tall trees, statement pieces"
          },
          { 
            label: "Cozy Corner", 
            value: "small", 
            icon: "🌿",
            image: spaceImages[1] || "/api/placeholder/400/300",
            description: "Compact plants, shelves, desk companions"
          }
        ];
      case "care":
        return [
          { 
            label: "Easy Going", 
            value: "low", 
            icon: "😌",
            image: careImages[0] || "/api/placeholder/400/300",
            description: "Forgiving plants, minimal attention needed"
          },
          { 
            label: "Green Thumb", 
            value: "high", 
            icon: "👩‍🌾",
            image: careImages[1] || "/api/placeholder/400/300",
            description: "Regular care, specific conditions, rewarding growth"
          }
        ];
      case "category":
        return [
          { 
            label: "Indoor Oasis", 
            value: "Indoor", 
            icon: "🏠",
            image: categoryImages[0] || "/api/placeholder/400/300",
            description: "Perfect for homes, offices, and indoor spaces"
          },
          { 
            label: "Garden Paradise", 
            value: "Outdoor", 
            icon: "🌳",
            image: categoryImages[1] || "/api/placeholder/400/300",
            description: "Beautiful gardens, balconies, and outdoor areas"
          }
        ];
      default:
        return [];
    }
  };

  const handleAnswer = (optionValue: string) => {
    setSelectedOption(optionValue);
    
    setTimeout(() => {
      const key = quizQuestions[currentQuestion].key;
      const newAnswers = { ...answers, [key]: optionValue };
      setAnswers(newAnswers);
      setSelectedOption(null);

      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        const recommended = products.filter(product => {
          const matchCategory = !newAnswers.category || product.category === newAnswers.category;
          const matchCare = !newAnswers.care || (
            newAnswers.care === "low" 
              ? product.wateringNeeds?.toLowerCase().includes("low") || 
                product.maintenanceLevel?.toLowerCase().includes("low")
              : product.wateringNeeds?.toLowerCase().includes("high") || 
                product.maintenanceLevel?.toLowerCase().includes("high")
          );
          const matchSpace = !newAnswers.space || (
            newAnswers.space === "small"
              ? product.size?.toLowerCase().includes("small") || 
                product.containerType?.toLowerCase().includes("small")
              : product.size?.toLowerCase().includes("large") || 
                product.containerType?.toLowerCase().includes("large")
          );
          
          return matchCategory && matchCare && matchSpace;
        });

        setResults(recommended.length > 0 ? recommended.slice(0, 4) : products.slice(0, 4));
        localStorage.setItem("quizDone", "true");
      }
    }, 600);
  };

  const retakeQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({ space: "", care: "", category: "" });
    setResults([]);
  };

  const closeOverlay = () => {
    setShowQuiz(false);
    setCurrentQuestion(0);
    setAnswers({ space: "", care: "", category: "" });
    setResults([]);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const fallback = target.nextElementSibling as HTMLElement;
    if (fallback) {
      fallback.classList.remove('hidden');
    }
  };

  return (
    <>
      {/* Floating Quiz Badge with Shake Animation */}
      {badgeVisible && (
        <div className="quiz-badge" onClick={() => setShowQuiz(true)}>
          <div className="badge-shake">🌱</div>
          <span className="badge-text">Find Your Plant!</span>
        </div>
      )}

      {/* Quiz Overlay */}
      {showQuiz && (
        <div className="quiz-overlay">
          <div className="quiz-container">
            {/* Header */}
            <div className="quiz-header">
              <div className="quiz-progress">
                <div className="progress-steps">
                  {quizQuestions.map((_, index) => (
                    <div 
                      key={index}
                      className={`progress-step ${index <= currentQuestion ? 'active' : ''} ${index < currentQuestion ? 'completed' : ''}`}
                    >
                      {index < currentQuestion ? (
                        <div className="check-icon">✓</div>
                      ) : (
                        index + 1
                      )}
                    </div>
                  ))}
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{width: `${((currentQuestion) / quizQuestions.length) * 100}%`}}
                  ></div>
                </div>
              </div>
              <button className="close-btn" onClick={closeOverlay}>
                ✕
              </button>
            </div>

            {/* Quiz Content */}
            <div className="quiz-content">
              {isLoading ? (
                <div className="loading-state">
                  <div className="plant-loader">
                    <div className="leaf leaf-1"></div>
                    <div className="leaf leaf-2"></div>
                    <div className="leaf leaf-3"></div>
                    <div className="stem"></div>
                  </div>
                  <p>Growing your perfect plant matches...</p>
                </div>
              ) : results.length === 0 ? (
                <>
                  {/* Question Section */}
                  <div className="question-section">
                    <div className="question-number">
                      Question {currentQuestion + 1} of {quizQuestions.length}
                    </div>
                    <h2>{quizQuestions[currentQuestion].question}</h2>
                    <p className="question-description">
                      {quizQuestions[currentQuestion].description}
                    </p>
                  </div>

                  {/* Options Grid */}
                  <div className="options-grid">
                    {getOptionsForQuestion(quizQuestions[currentQuestion].key).map((option, index) => (
                      <div
                        key={option.value}
                        className={`option-card ${selectedOption === option.value ? 'selected' : ''} ${selectedOption && selectedOption !== option.value ? 'fade-out' : ''}`}
                        onClick={() => handleAnswer(option.value)}
                      >
                        <div className="option-image-container">
                          <img 
                            src={option.image} 
                            alt={option.label}
                            className="option-image"
                            onError={handleImageError}
                          />
                          <div className="option-icon-fallback hidden">
                            <span className="fallback-icon">{option.icon}</span>
                          </div>
                          <div className="option-overlay">
                            <div className="option-number">{index + 1}</div>
                          </div>
                        </div>
                        <div className="option-content">
                          <div className="option-header">
                            <span className="option-emoji">{option.icon}</span>
                            <h3 className="option-title">{option.label}</h3>
                          </div>
                          <p className="option-description">{option.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* Results Section - التصميم الجديد */
                <div className="results-section">
                  <div className="results-header">
                    <div className="success-icon">🎉</div>
                    <h1>Your Perfect Plant Matches!</h1>
                    <p className="results-subtitle">
                      We found {results.length} plants that are perfect for you
                    </p>
                  </div>

                  <div className="results-grid">
                    {results.map((product, index) => (
                      <div
                        key={product.id}
                        className="product-card"
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => {
                          navigate(`/product/${product.id}`);
                          closeOverlay();
                        }}
                      >
                        <div className="product-image-container">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="product-image"
                            onError={handleImageError}
                          />
                          <div className="product-icon-fallback hidden">
                            <span className="fallback-icon">🪴</span>
                          </div>
                          <div className="perfect-match-badge">
                            <span className="match-icon">✓</span>
                            Perfect Match
                          </div>
                        </div>
                        
                        <div className="product-info">
                          <h3 className="product-name">{product.name}</h3>
                          
                          <div className="product-details">
                            <div className="detail-item">
                              <span className="detail-label">Type:</span>
                              <span className="detail-value">{product.category}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Care:</span>
                              <span className="detail-value">{product.wateringNeeds || "Moderate care"}</span>
                            </div>
                            {product.size && (
                              <div className="detail-item">
                                <span className="detail-label">Size:</span>
                                <span className="detail-value">{product.size}</span>
                              </div>
                            )}
                          </div>

                          <div className="product-footer">
                            <div className="price-section">
                              <span className="product-price">${product.price || "19.99"}</span>
                              <span className="currency">EGP</span>
                            </div>
                            <button 
                              className="quick-view-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/product/${product.id}`);
                                closeOverlay();
                              }}
                            >
                              Quick Look
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="results-actions">
                    <button className="retake-btn" onClick={retakeQuiz}>
                      <span>🔄</span>
                      Start Over
                    </button>
                    <button className="browse-btn" onClick={closeOverlay}>
                      Explore All Plants
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlantQuiz;