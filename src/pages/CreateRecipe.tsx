import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import styled from 'styled-components';
import { ArrowLeft, Plus, X } from 'lucide-react';
import api from '../services/api';
import { Ingredient, CreateRecipeData } from '../types';
import Layout from '../components/Layout';

export default function CreateRecipe() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    cooking_time: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    servings: 1,
    image_url: ''
  });
  const [ingredients, setIngredients] = useState<{
    ingredient_id: number;
    quantity: number;
    unit: string;
  }[]>([]);

  const { data: availableIngredients = [] } = useQuery<Ingredient[]>('ingredients', () =>
    api.get('/ingredients').then(res => res.data)
  );

  const createMutation = useMutation(
    (data: CreateRecipeData) => api.post('/recipes', data),
    {
      onSuccess: (response) => {
        navigate(`/recipes/${response.data.id}`);
      }
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.instructions) {
      alert('제목과 조리법은 필수입니다!');
      return;
    }

    const parsedTime = parseInt(formData.cooking_time);

    if (formData.cooking_time !== '' && (isNaN(parsedTime) || parsedTime <= 0)) {
      alert('조리 시간은 1분 이상이어야 합니다!');
      return;
    }

    const recipeData: CreateRecipeData = {
      title: formData.title,
      description: formData.description,
      instructions: formData.instructions,
      difficulty: formData.difficulty,
      servings: formData.servings,
      image_url: formData.image_url,
      ingredients,
      ...(parsedTime > 0 ? { cooking_time: parsedTime } : {})
    };

    createMutation.mutate(recipeData);
  };



  const addIngredient = () => {
    setIngredients(prev => [...prev, { ingredient_id: 0, quantity: 0, unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: string, value: any) => {
    setIngredients(prev =>
      prev.map((ing, i) =>
        i === index ? { ...ing, [field]: value } : ing
      )
    );
  };

  return (
    <Layout>
      <Container>
        <BackButton onClick={() => navigate('/recipes')}>
          <ArrowLeft size={16} />
          레시피 목록으로
        </BackButton>

        <FormCard>
          <FormTitle>새 레시피 만들기</FormTitle>

          <Form onSubmit={handleSubmit}>
            <FormRow>
              <FormGroup>
                <Label htmlFor="title">레시피 제목 *</Label>
                <Input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="image_url">이미지 URL</Label>
                <Input
                  type="url"
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                placeholder="레시피에 대한 간단한 설명을 입력하세요"
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label htmlFor="cooking_time">조리 시간 (분)</Label>
                <Input
                  type="number"
                  id="cooking_time"
                  value={formData.cooking_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, cooking_time: e.target.value }))}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="servings">인분</Label>
                <Input
                  type="number"
                  id="servings"
                  value={formData.servings}
                  onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) }))}
                  min="1"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="difficulty">난이도</Label>
                <Select
                  id="difficulty"
                  value={formData.difficulty}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                >
                  <option value="easy">쉬움</option>
                  <option value="medium">보통</option>
                  <option value="hard">어려움</option>
                </Select>
              </FormGroup>
            </FormRow>

            <FormGroup>
              <IngredientsHeader>
                <Label>재료</Label>
                <AddIngredientBtn type="button" onClick={addIngredient}>
                  <Plus size={16} />
                  재료 추가
                </AddIngredientBtn>
              </IngredientsHeader>

              <IngredientsList>
                {ingredients.map((ingredient, index) => (
                  <IngredientRow key={index}>
                    <Select
                      value={ingredient.ingredient_id}
                      onChange={(e) => updateIngredient(index, 'ingredient_id', parseInt(e.target.value))}
                    >
                      <option value={0}>재료 선택</option>
                      {availableIngredients.map((ing) => (
                        <option key={ing.id} value={ing.id}>
                          {ing.name}
                        </option>
                      ))}
                    </Select>
                    <QuantityInput
                      type="number"
                      value={ingredient.quantity}
                      onChange={(e) => updateIngredient(index, 'quantity', parseFloat(e.target.value))}
                      placeholder="수량"
                    />
                    <UnitInput
                      type="text"
                      value={ingredient.unit}
                      onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                      placeholder="단위"
                    />
                    <RemoveBtn
                      type="button"
                      onClick={() => removeIngredient(index)}
                    >
                      <X size={16} />
                    </RemoveBtn>
                  </IngredientRow>
                ))}
              </IngredientsList>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="instructions">조리법 *</Label>
              <Textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                rows={8}
                placeholder="단계별 조리법을 자세히 작성해주세요"
                required
              />
            </FormGroup>

            <ButtonGroup>
              <CancelButton
                type="button"
                onClick={() => navigate('/recipes')}
              >
                취소
              </CancelButton>
              <SubmitButton
                type="submit"
                disabled={createMutation.isLoading}
              >
                {createMutation.isLoading ? '생성 중...' : '레시피 만들기'}
              </SubmitButton>
            </ButtonGroup>
          </Form>
        </FormCard>
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

const FormCard = styled.div`
  background-color: white;
  border-radius: 15px;
  width: 70vw;
  padding: 40px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h1`
  font-size: 28px;
  color: #333;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #FD5215;
    box-shadow: 0 0 0 2px rgba(253, 82, 21, 0.2);
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #FD5215;
    box-shadow: 0 0 0 2px rgba(253, 82, 21, 0.2);
  }
`;

const Textarea = styled.textarea`
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

const IngredientsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const AddIngredientBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: #FD5215;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #e8470f;
  }
`;

const IngredientsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const IngredientRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 100px 80px 40px;
  gap: 12px;
  align-items: center;
`;

const QuantityInput = styled(Input)`
  text-align: center;
`;

const UnitInput = styled(Input)`
  text-align: center;
`;

const RemoveBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #d32f2f;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
`;

const CancelButton = styled.button`
  padding: 12px 24px;
  border: 1px solid #ddd;
  background-color: white;
  color: #666;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const SubmitButton = styled.button`
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