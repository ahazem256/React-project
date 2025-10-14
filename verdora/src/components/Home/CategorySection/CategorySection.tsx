import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategorySection.css';
import { FaLeaf } from "react-icons/fa";

interface Category {
    id: number;
    name: string;
    icon: string;
    path: string;
}

const CategoriesSection: React.FC = () => {
    const navigate = useNavigate();


    const categories: Category[] = [
        {
            id: 1,
            name: 'Indoor',
            icon: '🪴',
            path: '/categories/Indoor'
        },
        {
            id: 2,
            name: 'Outdoor',
            icon: '🌳',
            path: '/categories/Outdoor'
        },
        {
            id: 3,
            name: 'Flowering Plants',
            icon: '🌺',
            path: '/categories/Flowering'
        },
        {
            id: 4,
            name: 'Bonsai & Miniature Plants',
            icon: '🎋',
            path: '/categories/Bonsai_miniature'
        }
    ];

    const handleCategoryClick = (path: string) => {
        navigate(path);
    };

    return (
        <div className="categories">
            <h2 className="categories-title"><FaLeaf size={28} className="footer-leaf" />Browse By Categories</h2>
            <div className="categories-grid">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="category-card"
                        onClick={() => handleCategoryClick(category.path)}
                    >
                        <div className="category-icon-container">
                            <span className="category-icon">{category.icon}</span>
                        </div>
                        <h3 className="category-name">{category.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoriesSection;