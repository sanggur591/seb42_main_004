import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setDietPlan, setReset } from '../../reducers/surveyQuestionReducer';
import { Option, ExplanationDiv } from './SurveyPage2';
import { SurveyH3 } from './SurveyPage1';
import PreAndNextButtons from './PreAndNextButtons';
import getData from '../../util/getData';
import SurveyBox from './SurveyBox';
import DietInfo from './DietInfo';

function SurveyPage3() {
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let location = useLocation();

  // 다이어트 플랜 상태 변경
  let dispatchPlan = (e) => {
    let { id } = e.target;
    dispatch(setDietPlan(id));
  };

  // 설문 결과 get 요청 + 화면 전환
  let { dietPlan } = useSelector((state) => state.surveyQuestionReducer);

  let api = `${process.env.REACT_APP_API_URL}`;

  let nextHandler = () => {
    let page3Param = `?kcal=${dietPlan}`;
    let data = getData(api + page3Param);
    navigate(`/survey/result`, data);
    dispatch(setReset());
  };

  let planInfo;
  useEffect(() => {
    planInfo = location.state;
    console.log(planInfo);
  }, []);

  return (
    <article>
      <SurveyH3>
        밀박스 추천을 위한 <br />
        다이어트 플랜를 선택해주세요.
      </SurveyH3>
      <ExplanationDiv>
        선택한 플랜에 따라 일일 칼로리 및 예상 체중이 조정됩니다.
      </ExplanationDiv>
      <Option>
        <SurveyBox
          id="Easy"
          group="plan"
          info={<DietInfo kcal="1600" weight="00.0" target="1.6" />}
          changeHandler={dispatchPlan}
          checked={dietPlan === 'Easy'}
        >
          <div>
            다이어트는 너무 길어지면 힘들지만 무작정 빨리갈 수는 없어요.
          </div>
          <div>천천히 목표를 향해 나아가보아요.</div>
        </SurveyBox>
        <SurveyBox
          id="Normal"
          group="plan"
          info={<DietInfo kcal="1200" weight="00.0" target="2.1" />}
          changeHandler={dispatchPlan}
          checked={dietPlan === 'Normal'}
        >
          <div>
            이왕 다이어트를 하는거라면 조금은 도전적인 선택도 좋을거예요!
          </div>
        </SurveyBox>
        <SurveyBox
          id="Hard"
          group="plan"
          info={<DietInfo kcal="800" weight="00.0" target="2.9" />}
          changeHandler={dispatchPlan}
          checked={dietPlan === 'Hard'}
        >
          <div>
            다이어트에 대한 강한 의지나 다가오는 중요한 일정이 있으신가요?
          </div>
          <div>강도가 높아 지키기 힘들 수도 있어요.</div>
        </SurveyBox>
      </Option>
      <PreAndNextButtons nextHandler={nextHandler} />
    </article>
  );
}

export default SurveyPage3;
