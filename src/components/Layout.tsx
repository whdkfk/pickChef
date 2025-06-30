import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ChefHat } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const getSelectedIndex = () => {
    if (location.pathname === '/') return 0;
    if (location.pathname.startsWith('/ingredients')) return 1;
    if (location.pathname.startsWith('/recipes')) return 2;
    return -1;
  };

  const selectedIndex = getSelectedIndex();

  return (
    <Container>
      <Top>
        <LogoContainer onClick={() => navigate('/')}>
          <ChefHat size={40} color="#FD5215" />
          <LogoText>PickChef</LogoText>
        </LogoContainer>
        <Header>
          <Text isColor={selectedIndex === 0} onClick={() => navigate('/')}>HOME</Text>
          <Text isColor={selectedIndex === 1} onClick={() => navigate('/ingredients')}>INGREDIENT</Text>
          <Text isColor={selectedIndex === 2} onClick={() => navigate('/recipes')}>RECIPE</Text>
        </Header>
      </Top>
      <Main>
        {children}
      </Main>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 50px;
  background-color: rgba(255, 255, 255, 0.3);
  width: 100%;
  height: 95vh;
  padding: 30px 50px;
`;

const Top = styled.div`
  display: flex;
  gap: 250px;
  align-items: center;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const LogoText = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #333;
`;

const Header = styled.div`
  display: flex;
  gap: 70px;

  h2 {
    margin-top: 5px;
  }
`;

const Text = styled.h2<{ isColor: boolean }>`
  cursor: pointer;
  color: ${props => (props.isColor ? 'white' : 'black')};
  user-select: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: ${props => (props.isColor ? 'white' : '#FD5215')};
  }
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  margin-top: 20px;
`;