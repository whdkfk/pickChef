import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { ArrowLeft, Clock, Users, Star, MessageCircle } from 'lucide-react';
import api from '../services/api';
import { Recipe, Rating } from '../types';
import Layout from '../components/Layout';

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const { data: recipe, isLoading } = useQuery<Recipe>(
    ['recipe', id],
    () => api.get(`/recipes/${id}`).then(res => res.data),
    { enabled: !!id }
  );

  const { data: ratings = [] } = useQuery<Rating[]>(
    ['ratings', id],
    () => api.get(`/recipes/${id}/ratings`).then(res => res.data),
    { enabled: !!id }
  );

  const ratingMutation = useMutation(
    (data: { rating: number; comment?: string }) =>
      api.post(`/recipes/${id}/ratings`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ratings', id]);
        queryClient.invalidateQueries(['recipe', id]);
        setComment('');
      }
    }
  );

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    ratingMutation.mutate({ rating, comment: comment || undefined });
  };

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

  if (!recipe) {
    return (
      <Layout>
        <ErrorContainer>
          <ErrorTitle>레시피를 찾을 수 없습니다</ErrorTitle>
          <BackButton onClick={() => navigate('/recipes')}>
            레시피 목록으로 돌아가기
          </BackButton>
        </ErrorContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <BackButton onClick={() => navigate('/recipes')}>
          <ArrowLeft size={16} />
          레시피 목록으로
        </BackButton>

        <RecipeCard>
          <RecipeImage>
            {recipe.image_url ? (
              <img src={recipe.image_url} alt={recipe.title} />
            ) : (
              <PlaceholderIcon>🍳</PlaceholderIcon>
            )}
          </RecipeImage>

          <RecipeContent>
            <RecipeHeader>
              <div>
                <RecipeTitle>{recipe.title}</RecipeTitle>
                {recipe.description && (
                  <RecipeDescription>{recipe.description}</RecipeDescription>
                )}
              </div>
              <RatingContainer>
                <Star size={24} color="#FFD700" fill="#FFD700" />
                <RatingText>{recipe.average_rating.toFixed(1)}</RatingText>
              </RatingContainer>
            </RecipeHeader>

            <RecipeMeta>
              {recipe.cooking_time && (
                <MetaItem>
                  <Clock size={20} />
                  <span>{recipe.cooking_time}분</span>
                </MetaItem>
              )}
              <MetaItem>
                <Users size={20} />
                <span>{recipe.servings}인분</span>
              </MetaItem>
              <DifficultyBadge color={getDifficultyColor(recipe.difficulty)}>
                {getDifficultyText(recipe.difficulty)}
              </DifficultyBadge>
            </RecipeMeta>

            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <Section>
                <SectionTitle>재료</SectionTitle>
                <IngredientsContainer>
                  {recipe.ingredients.map((ingredient, index) => (
                    <IngredientItem key={index}>
                      <IngredientName>{ingredient.ingredient?.name}</IngredientName>
                      <IngredientAmount>
                        {ingredient.quantity} {ingredient.unit}
                      </IngredientAmount>
                    </IngredientItem>
                  ))}
                </IngredientsContainer>
              </Section>
            )}

            <Section>
              <SectionTitle>조리법</SectionTitle>
              <Instructions>{recipe.instructions}</Instructions>
            </Section>
          </RecipeContent>
        </RecipeCard>

        {/* Rating Section */}
        <RatingSection>
          <SectionTitle>이 레시피는 어떠셨나요?</SectionTitle>
          <RatingForm onSubmit={handleSubmitRating}>
            <RatingInputContainer>
              <RatingLabel>평점</RatingLabel>
              <StarContainer>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarButton
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    active={star <= rating}
                  >
                    ★
                  </StarButton>
                ))}
              </StarContainer>
            </RatingInputContainer>
            <CommentContainer>
              <RatingLabel>후기 (선택사항)</RatingLabel>
              <CommentTextarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="레시피에 대한 후기를 남겨주세요..."
              />
            </CommentContainer>
            <SubmitButton type="submit" disabled={ratingMutation.isLoading}>
              {ratingMutation.isLoading ? '등록 중...' : '후기 등록'}
            </SubmitButton>
          </RatingForm>
        </RatingSection>

        <ReviewsSection>
          <ReviewsHeader>
            <MessageCircle size={20} />
            <SectionTitle>후기 ({ratings.length})</SectionTitle>
          </ReviewsHeader>
          
          {ratings.length > 0 ? (
            <ReviewsList>
              {ratings.map((rating) => (
                <ReviewItem key={rating.id}>
                  <ReviewHeader>
                    <ReviewMeta>
                      <ReviewAuthor>익명</ReviewAuthor>
                      <StarRating>
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} style={{ color: i < rating.rating ? '#FFD700' : '#ddd' }}>
                            ★
                          </span>
                        ))}
                      </StarRating>
                    </ReviewMeta>
                    <ReviewDate>
                      {new Date(rating.created_at).toLocaleDateString()}
                    </ReviewDate>
                  </ReviewHeader>
                  {rating.comment && (
                    <ReviewComment>{rating.comment}</ReviewComment>
                  )}
                </ReviewItem>
              ))}
            </ReviewsList>
          ) : (
            <EmptyReviews>
              아직 후기가 없습니다. 첫 번째 후기를 남겨보세요!
            </EmptyReviews>
          )}
        </ReviewsSection>
      </Container>
    </Layout>
  );
}

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 20px;
  
  &:hover {
    color: #333;
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

const ErrorContainer = styled.div`
  text-align: center;
  padding: 100px 20px;
`;

const ErrorTitle = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
`;

const RecipeCard = styled.div`
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const RecipeImage = styled.div`
  height: 300px;
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
  font-size: 100px;
  opacity: 0.7;
`;

const RecipeContent = styled.div`
  padding: 30px;
`;

const RecipeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const RecipeTitle = styled.h1`
  font-size: 28px;
  color: #333;
  margin-bottom: 10px;
`;

const RecipeDescription = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.6;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RatingText = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: #333;
`;

const RecipeMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  color: #666;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
`;

const DifficultyBadge = styled.span<{ color: string }>`
  background-color: ${props => props.color}20;
  color: ${props => props.color};
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 500;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
`;

const IngredientsContainer = styled.div`
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
`;

const IngredientItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const IngredientName = styled.span`
  color: #333;
  font-weight: 500;
`;

const IngredientAmount = styled.span`
  color: #666;
`;

const Instructions = styled.div`
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  white-space: pre-wrap;
  line-height: 1.8;
  color: #333;
`;

const RatingSection = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const RatingForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RatingInputContainer = styled.div``;

const RatingLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
`;

const StarContainer = styled.div`
  display: flex;
  gap: 4px;
`;

const StarButton = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  font-size: 24px;
  color: ${props => props.active ? '#FFD700' : '#ddd'};
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: #FFD700;
  }
`;

const CommentContainer = styled.div``;

const CommentTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #FD5215;
    box-shadow: 0 0 0 2px rgba(253, 82, 21, 0.2);
  }
`;

const SubmitButton = styled.button`
  align-self: flex-start;
  padding: 12px 24px;
  background-color: #FD5215;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover:not(:disabled) {
    background-color: #e8470f;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ReviewsSection = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const ReviewsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  color: #666;
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ReviewItem = styled.div`
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ReviewMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ReviewAuthor = styled.span`
  font-weight: 500;
  color: #333;
`;

const StarRating = styled.div`
  display: flex;
  gap: 2px;
`;

const ReviewDate = styled.span`
  font-size: 12px;
  color: #999;
`;

const ReviewComment = styled.p`
  color: #666;
  line-height: 1.6;
`;

const EmptyReviews = styled.div`
  text-align: center;
  color: #999;
  padding: 40px 0;
`;