import styled from 'styled-components';
import InputLabelDiv from '../commons/InputLabelDiv';
import MainButton from '../commons/MainButton';
import PreAndNextButtons from './PreAndNextButtons';

function SurveyPage1() {
  let maleHandler = (e) => {
    console.log(e.target);
  };

  let femaleHandler = (e) => {
    console.log(e.target);
  };

  return (
    <Article>
      <SurveyH3>
        밀박스 추천을 위해
        <br />
        정보를 입력해주세요.
      </SurveyH3>
      <SurveyContentDiv>
        <InputLabelDiv label="생년월일" id="name" placeholder="2000.01.01" />
        <div>
          <div>성별</div>
          <GenderOptionDiv>
            <MainButton name="남성" handler={maleHandler} />
            <MainButton name="여성" handler={femaleHandler} />
          </GenderOptionDiv>
        </div>
        <InputLabelDiv label="신장" id="name" placeholder="0" unit="cm" />
        <InputLabelDiv label="체중" id="name" placeholder="0" unit="kg" />
        <PreAndNextButtons />
      </SurveyContentDiv>
    </Article>
  );
}

export default SurveyPage1;

const Article = styled.article`
  /* display: flex;
  flex-direction: column;
  align-items: center; */
`;

export const SurveyH3 = styled.h3`
  margin-bottom: 1rem;
  white-space: nowrap;
  font-size: 1.8rem;
  font-family: 'IBM Plex Sans KR', sans-serif;
`;

const SurveyContentDiv = styled.div`
  > div:last-child {
    margin-top: 20px;
  }

  label,
  > div > div:first-child {
    display: block;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  input {
    padding: 15px;
  }

  span {
    margin-right: 15px;
  }
`;

const GenderOptionDiv = styled.div`
  display: flex;
  justify-content: space-between;

  *:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  > button {
    padding: 30px 0;
    flex-grow: 1;

    :first-child {
      margin-right: 5px;
    }
    :last-child {
      margin-left: 5px;
    }
  }
`;
