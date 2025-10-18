import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategorySection.css';

interface Category {
    id: number;
    name: string;
    backgroundImage: string;
    path: string;
}

const CategoriesSection: React.FC = () => {
    const navigate = useNavigate();


    const categories: Category[] = [
        {
            id: 1,
            name: 'Indoor Plants',
            backgroundImage: "url('https://i.pinimg.com/1200x/98/85/f3/9885f38dc02d4aad94ffe92bfc728894.jpg')",
            path: '/categories/Indoor'
        },
        {
            id: 2,
            name: 'Outdoor Plants',
            backgroundImage: "url('https://i.pinimg.com/1200x/9c/66/90/9c6690ba911eb325a088e28ed710b4f4.jpg')",
            path: '/categories/Outdoor'
        },
        {
            id: 3,
            name: 'Flowering Plants',
            backgroundImage: "url('https://i.pinimg.com/1200x/75/6f/ed/756fed349a15e9513c7cd2d1cdc0a544.jpg')",
            path: '/categories/Flowering'
        },
        {
            id: 4,
            name: 'Bonsai Plants',
            backgroundImage: `url(https://i.pinimg.com/1200x/2a/87/be/2a87be0f62dea3adc5922cfeb3db6538.jpg)`,
            path: '/categories/Bonsai_miniature'
        }
    ];

    const handleCategoryClick = (path: string) => {
        navigate(path);
    };

    return (
        <div className="categories">
            <h2 className="categories-title">  Browse By Categories</h2>
            <div className="categories-grid">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="category-card"
                        onClick={() => handleCategoryClick(category.path)}
                    >
                        <div
                            className="category-icon-container"
                            style={{ backgroundImage: category.backgroundImage }}
                        >
                            <h3 className="category-name">{category.name}</h3>
                        </div>


                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoriesSection;