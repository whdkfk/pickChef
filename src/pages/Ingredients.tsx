import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import styled, { css } from 'styled-components';
import { Plus, Edit, Trash2, Check, X } from 'lucide-react';
import api from '../services/api';
import { Ingredient } from '../types';
import Layout from '../components/Layout';

interface IngredientForm {
  id?: number;
  name: string;
  category: string;
  unit: string;
  isEditing: boolean;
}

export default function Ingredients() {
  const queryClient = useQueryClient();
  const [ingredients, setIngredients] = useState<IngredientForm[]>([
    { name: '', category: '', unit: '', isEditing: true }
  ]);

  const { data: existingIngredients = [] } = useQuery<Ingredient[]>('ingredients', () =>
    api.get('/ingredients').then(res => res.data)
  );

  const createMutation = useMutation(
    (ingredient: { name: string; category: string; unit: string }) =>
      api.post('/ingredients', ingredient),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('ingredients');
      }
    }
  );

  const updateMutation = useMutation(
    ({ id, ...data }: { id: number; name?: string; category?: string; unit?: string }) =>
      api.put(`/ingredients/${id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('ingredients');
      }
    }
  );

  const deleteMutation = useMutation(
    (id: number) => api.delete(`/ingredients/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('ingredients');
      }
    }
  );

  const handleConfirm = async (index: number) => {
    const ingredient = ingredients[index];
    if (!ingredient.name || !ingredient.category || !ingredient.unit) {
      alert('모든 필드를 입력해주세요!');
      return;
    }

    try {
      if (ingredient.id) {
        await updateMutation.mutateAsync({
          id: ingredient.id,
          name: ingredient.name,
          category: ingredient.category,
          unit: ingredient.unit
        });
      } else {
        await createMutation.mutateAsync({
          name: ingredient.name,
          category: ingredient.category,
          unit: ingredient.unit
        });
      }

      setIngredients(prev =>
        prev.map((item, i) =>
          i === index ? { ...item, isEditing: false } : item
        )
      );
    } catch (error: any) {
      alert(error.response?.data?.detail || '재료 저장에 실패했습니다!');
    }
  };

  const handleAdd = () => {
    setIngredients(prev => [
      ...prev,
      { name: '', category: '', unit: '', isEditing: true }
    ]);
  };

  const handleRemove = async (index: number) => {
    const ingredient = ingredients[index];
    if (ingredient.id) {
      try {
        await deleteMutation.mutateAsync(ingredient.id);
      } catch (error: any) {
        alert(error.response?.data?.detail || '재료 삭제에 실패했습니다!');
        return;
      }
    }
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof IngredientForm, value: string) => {
    setIngredients(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleEdit = (index: number) => {
    setIngredients(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, isEditing: true } : item
      )
    );
  };

  React.useEffect(() => {
    if (existingIngredients.length > 0 && ingredients.length === 1 && !ingredients[0].name) {
      const mappedIngredients = existingIngredients.map(ing => ({
        id: ing.id,
        name: ing.name,
        category: ing.category,
        unit: ing.unit,
        isEditing: false
      }));
      setIngredients([...mappedIngredients, ingredients[0]]);
    }
  }, [existingIngredients]);

  return (
    <Layout>
      <HeaderSection>
        <Title>재료 관리</Title>
        <PlusBtn onClick={handleAdd}>
          <Plus size={16} />
          재료 추가
        </PlusBtn>
      </HeaderSection>

      <IngredientMain>
        <IngredientTop>
          <p>재료이름</p>
          <p>재료분류</p>
          <p>단위</p>
        </IngredientTop>

        {ingredients.map((ingredient, index) => (
          <IngredientWrite key={index}>
            <IndexNumber>{index + 1}</IndexNumber>

            {ingredient.isEditing ? (
              <>
                <FieldInput
                  type="text"
                  value={ingredient.name}
                  onChange={e => handleChange(index, 'name', e.target.value)}
                  placeholder="재료 이름"
                />
                <FieldInput
                  type="text"
                  value={ingredient.category}
                  onChange={e => handleChange(index, 'category', e.target.value)}
                  placeholder="분류"
                />
                <FieldInput
                  type="text"
                  value={ingredient.unit}
                  onChange={e => handleChange(index, 'unit', e.target.value)}
                  placeholder="단위"
                />
                <ActionContainer>
                  <ActionBtn onClick={() => handleConfirm(index)} color="#4CAF50">
                    <Check size={16} />
                    확인
                  </ActionBtn>
                  {ingredient.id && (
                    <ActionBtn onClick={() => handleRemove(index)} color="#f44336">
                      <X size={16} />
                      취소
                    </ActionBtn>
                  )}
                </ActionContainer>
              </>
            ) : (
              <>
                <FieldText>{ingredient.name}</FieldText>
                <FieldText>{ingredient.category}</FieldText>
                <FieldText>{ingredient.unit}</FieldText>
                <ActionContainer>
                  <ActionBtn onClick={() => handleEdit(index)} color="#2196F3">
                    <Edit size={16} />
                    수정
                  </ActionBtn>
                  <ActionBtn onClick={() => handleRemove(index)} color="#f44336">
                    <Trash2 size={16} />
                    삭제
                  </ActionBtn>
                </ActionContainer>
              </>
            )}
          </IngredientWrite>
        ))}
      </IngredientMain>
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

const PlusBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 10px;
  border: none;
  background-color: #FD5215;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #e8470f;
  }
`;

const IngredientMain = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 50px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const IngredientTop = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr 1.7fr 0fr;
  gap: 130px;
  background-color: #FCE392;
  padding: 20px 110px;
  font-weight: bold;
  color: #666;
`;

const IngredientWrite = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 1fr 1fr 200px;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid #eee;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
`;

const IndexNumber = styled.div`
  font-weight: bold;
  color: #666;
  text-align: center;
`;

const sharedFieldStyle = css`
  border-radius: 8px;
  border: 1px solid #ddd;
  height: 40px;
  padding: 0 12px;
  font-size: 14px;
  box-sizing: border-box;
`;

const FieldInput = styled.input`
  ${sharedFieldStyle};
  
  &:focus {
    outline: none;
    border-color: #FD5215;
    box-shadow: 0 0 0 2px rgba(253, 82, 21, 0.2);
  }
`;

const FieldText = styled.div`
  ${sharedFieldStyle};
  border: none;
  background-color: transparent;
  display: flex;
  align-items: center;
  color: #333;
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionBtn = styled.button<{ color: string }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background-color: ${props => props.color}20;
  color: ${props => props.color};
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${props => props.color}30;
  }
`;