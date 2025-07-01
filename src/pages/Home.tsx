import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Layout>
      <MainContent>
        <TextSection>
          <Pick>뭐해 먹을지</Pick>
          <Pick>모르겠다면, 픽셰프!</Pick>
          <Description>
            냉장고 속 재료로 맛있는 레시피를 찾아보세요.
            <br />
            매일 새로운 맛을 경험하세요.
          </Description>
          <IBtn onClick={() => navigate('/ingredients')}>
            Add Ingredient 
            <ArrowRight size={16} style={{ marginLeft: '8px' }} />
          </IBtn>
        </TextSection>
        <FoodEmoji>🍳</FoodEmoji>
      </MainContent>
      
      <FeatureSection>
        <FeatureCard>
          <FeatureIcon>🥕</FeatureIcon>
          <FeatureTitle>재료 관리</FeatureTitle>
          <FeatureDesc>냉장고 속 재료를 쉽게 등록하고 관리하세요.</FeatureDesc>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>🔍</FeatureIcon>
          <FeatureTitle>레시피 확인</FeatureTitle>
          <FeatureDesc>예전에 만들었던 레시피를 찾아보세요.</FeatureDesc>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>⭐</FeatureIcon>
          <FeatureTitle>레시피 관리</FeatureTitle>
          <FeatureDesc>보유한 재료로 만들 수 있는 레시피를 등록해보세요.</FeatureDesc>
        </FeatureCard>
      </FeatureSection>
    </Layout>
  );
}

const MainContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 100px;
  padding: 0 50px;
`;

const TextSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const Pick = styled.h1`
  display: flex;
  white-space: nowrap;
  font-size: 50px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
`;

const Description = styled.p`
  font-size: 18px;
  color: #666;
  margin: 20px 0 30px 0;
  line-height: 1.6;
`;

const IBtn = styled.button`
  width: 200px;
  height: 45px;
  border-radius: 10px;
  border: none;
  background-color: #FD5215;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #e8470f;
  }
`;

const FoodEmoji = styled.div`
  font-size: 200px;
  margin-right: 100px;
`;

const FeatureSection = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 80px;
  padding: 0 50px;
`;

const FeatureCard = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
`;

const FeatureTitle = styled.h3`
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
`;

const FeatureDesc = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
`;