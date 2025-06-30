import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Plus, Clock, Users, Star } from 'lucide-react';
import api from '../services/api';
import { Recipe } from '../types';
import Layout from '../components/Layout';

export default function Recipes() {
  const { data: recipes = [], isLoading } = useQuery<Recipe[]>('recipes', () =>
    api.get('/recipes').then(res => res.data)
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#f44336';
      default: return '#666';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '쉬움';
      case 'medium': return '보통';
      case 'hard': return '어려움';
      default: return difficulty;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>레시피를 불러오는 중...</LoadingText>
        </LoadingContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <HeaderSection>
        <Title>레시피</Title>
        <AddBtn to="/recipes/create">
          <Plus size={16} />
          레시피 추가
        </AddBtn>
      </HeaderSection>

      {recipes.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🍳</EmptyIcon>
          <EmptyTitle>레시피가 없습니다</EmptyTitle>
          <EmptyDesc>첫 번째 레시피를 만들어보세요!</EmptyDesc>
          <AddBtn to="/recipes/create">
            <Plus size={16} />
            레시피 만들기
          </AddBtn>
        </EmptyState>
      ) : (
        <CardList>
          {recipes.map((recipe) => (
            <Card key={recipe.id} to={`/recipes/${recipe.id}`}>
              <CardImage>
                {recipe.image_url ? (
                  <img src={recipe.image_url} alt={recipe.title} />
                ) : (
                  <PlaceholderIcon>🍳</PlaceholderIcon>
                )}
              </CardImage>
              
              <CardContent>
                <CardHeader>
                  <CardTitle>{recipe.title}</CardTitle>
                  <RatingContainer>
                    <Star size={16} color="#FFD700" fill="#FFD700" />
                    <RatingText>{recipe.average_rating.toFixed(1)}</RatingText>
                  </RatingContainer>
                </CardHeader>
                
                {recipe.description && (
                  <CardDescription>{recipe.description}</CardDescription>
                )}
                
                <CardMeta>
                  <MetaItem>
                    {recipe.cooking_time && (
                      <>
                        <Clock size={14} />
                        <span>{recipe.cooking_time}분</span>
                      </>
                    )}
                  </MetaItem>
                  <MetaItem>
                    <Users size={14} />
                    <span>{recipe.servings}인분</span>
                  </MetaItem>
                  <DifficultyBadge color={getDifficultyColor(recipe.difficulty)}>
                    {getDifficultyText(recipe.difficulty)}
                  </DifficultyBadge>
                </CardMeta>
              </CardContent>
            </Card>
          ))}
        </CardList>
      )}
    </Layout>
  );
}

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 50px;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #333;
`;

const AddBtn = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 10px;
  background-color: #FD5215;
  color: white;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #e8470f;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #FD5215;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 20px;
  color: #666;
  font-size: 16px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 80px;
  margin-bottom: 20px;
`;

const EmptyTitle = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
`;

const EmptyDesc = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
`;

const CardList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  padding: 0 50px;
`;

const Card = styled(Link)`
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const CardImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #ff9a56 0%, #ff6b35 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlaceholderIcon = styled.div`
  font-size: 60px;
  opacity: 0.7;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin: 0;
  flex: 1;
  margin-right: 10px;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RatingText = styled.span`
  font-size: 14px;
  color: #666;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const DifficultyBadge = styled.span<{ color: string }>`
  background-color: ${props => props.color}20;
  color: ${props => props.color};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
`;