import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import {Container} from '@sberdevices/plasma-ui';

import ScheduleDay from "./ScheduleDay";
import TopMenu from './TopMenu';
import WeekCarousel from "./WeekCarousel";
import WeekSelect from "./WeekSelect";
import {
  history,
} from '../App'
import ApiModel, {IScheduleDays} from "../lib/ApiModel"
import {Spacer100,Spacer200,Spacer300} from './Spacers'
import {
  IDayHeader,
  OTHER_WEEK,
  THIS_OR_OTHER_WEEK,
  THIS_WEEK,
} from '../types/base.d'
import {
  formatFullGroupName,
} from '../lib/formatters';


const FIRST_DAY_OTHER_WEEK = 8;

const DAY_IN_SECONDS = 86400


export interface ScheduleViewProps {
  apiModel: ApiModel
  timeParam: number
  groupName: string | undefined
  onSetValue: (string, any) => void
  PreviousWeek: () => void
  CurrentWeek: () => void
  NextWeek: () => void
  getCurrentLesson: (Date) => string
  weekParam: number
  day: IDayHeader[]
  today: number
  schedule: {
    current_week: IScheduleDays
    other_week: IScheduleDays
  }
  doSetTeacher: (string) => Promise<void>
  getIsCorrectTeacher: () => boolean
  Date: number
  IsSavedSchedule: boolean
  IsCurrentWeek: Boolean
}

interface ScheduleViewState {
  current: string
  page: number
  formatDate: (weekDayShort: string, dateDdDotMm: string) => string
  isTeacher: boolean
  groupName: string
  weekParam: number
  teacher: string
  schedule: {
    current_week: IScheduleDays
    other_week: IScheduleDays
  }
  Day: number
}

export class ScheduleView extends React.Component<ScheduleViewProps, ScheduleViewState> {


  constructor(props) {
    super(props);
    this.onHandleChange = this.onHandleChange.bind(this)
    this.PreviousWeek = this.PreviousWeek.bind(this)
    this.NextWeek = this.NextWeek.bind(this);
    this.CurrentWeek = this.CurrentWeek.bind(this);

    let weekParam: THIS_OR_OTHER_WEEK = THIS_WEEK;
    let _timeparam = this.props.timeParam
    if (this.props.timeParam > 7) {
      _timeparam -= 7;
      weekParam = OTHER_WEEK
    }


    const getIsCorrectTeacher = () => {
      return this.props.getIsCorrectTeacher()
    }

    let apiModel =this.props.apiModel;
    let subGroupName = apiModel.isSavedUser ? apiModel.user?.subgroup_name : apiModel.unsavedUser?.subgroup_name
    let teacher =this.props.apiModel.isSavedUser? this.props.apiModel.user?.teacher : this.props.apiModel.unsavedUser?.teacher
    if(teacher == undefined){
      teacher = ""
    }
    let schedule = this.props.apiModel.isSavedSchedule ? this.props.apiModel.saved_schedule : this.props.apiModel.other_schedule

    this.state = {
      current: this.props.getCurrentLesson(new Date()),
      page: this.props.weekParam === OTHER_WEEK ? FIRST_DAY_OTHER_WEEK : 0,
      formatDate: (weekDayShort, dateDdDotMm) => `${weekDayShort} ${dateDdDotMm}`,
      isTeacher: getIsCorrectTeacher(),
      groupName: formatFullGroupName(this.props.groupName ? this.props.groupName : "", subGroupName ? subGroupName : ""),
      weekParam: weekParam,
      teacher : teacher,
      schedule: schedule,
      Day: this.props.timeParam
    }
   
  }


  async PreviousWeek() {
    //this.props.PreviousWeek()
    // await this.refetchData(Number(Number(this.props.Date)+Number(DAY_IN_SECONDS*7)), false);
  }

  async NextWeek() {
    // this.props.NextWeek()
    // await this.refetchData(Math.floor(Number(new Date())/1000), false);
    // this.setState({});
  }

  async CurrentWeek() {
    //this.props.CurrentWeek();
    // await this.refetchData(Number(Number(this.props.Date)-Number(DAY_IN_SECONDS*7)), true);
  }

  onHandleChange(key: string, value: any): void {
    this.props.onSetValue(key, value);
  }

  // async refetchData(date: number, isCurrentWeek : Boolean) {
  //   await this.props.apiModel.getScheduleFromDb(date, this.props.IsSavedSchedule, isCurrentWeek)
  //
  // }

  componentDidMount() {
    console.log("ScheduleView: componentDidMount")
    // this.refetchData(Math.floor(Number(new Date())/1000), true);
  }

  render() {

    // let schedule = this.props.apiModel.isSavedSchedule ? this.props.apiModel.saved_schedule : this.props.apiModel.other_schedule

    const {schedule } = this.props;

    console.log("ScheduleView: render")
    console.log("ScheduleView: render, Schedule:", this.props.apiModel.saved_schedule)
    console.log("ScheduleView: render, IsCurrentWeek:",this.props.IsCurrentWeek )
    console.log("ScheduleView: render, Day:", this.state.Day )
    console.log(this.props.IsCurrentWeek ? "CURRENT WEEK" : "OTHER WEEKs")
    // console.log("ScheduleView: render, ScheduleDay:", String(this.props.IsCurrentWeek)=="true" ? schedule.current_week[this.state.Day-1] : schedule.other_week[this.state.Day-1])

    let isReady = this.props.apiModel.isSchedule
  
    // console.log(schedule);
    console.log('Day', this.state.Day)
    return (
 /*     <DeviceThemeProvider>
      <DocStyle/>
      {
        getThemeBackgroundByChar(this.props.character, this.props.theme)
      }
  */
      <div>
        <Container style={{
          padding: 0,
          //  overflow: "scroll",
          minHeight: '100%',
        }}>
          <TopMenu
            subLabel={
              !this.props.apiModel.isStudent
                ? this.state.teacher
                : 
                //this.props.groupName
               this.state.groupName
            }
            onHomeClick={() => history.push('/home')}
            onDashboardClick={async () => {

              if (this.props.apiModel.unsavedUser) {
                await this.props.apiModel.getScheduleFromDb(Number(new Date()), true, true);
              }
              this.onHandleChange("isSavedSchedule", true)
              history.push("/dashboard")
            }}
            Bd={() =>this.props.apiModel.getScheduleFromDb(Number(new Date()), true, true)}
          />

          <WeekSelect
            onPrevWeekClick={async () => {
              await this.PreviousWeek()
              isReady = false;
              history.push('/schedule/'+Number(Number(this.props.Date)-Number(DAY_IN_SECONDS*7))+'/'+true+'/'+false)
            }}
            onThisWeekClick={() => {
              this.CurrentWeek();
              history.push('/schedule/'+Math.floor(Number(new Date())/1000)+'/'+true+'/'+true)
            }}
            onNextWeekClick={async () => {
             // await this.NextWeek();
              //this.onHandleChange("flag", false)
              //this.onHandleChange("page", FIRST_DAY_OTHER_WEEK)
              isReady = false;
              history.push('/schedule/'+Number(Number(this.props.Date)+Number(DAY_IN_SECONDS*7))+'/'+true+'/'+false)
              console.log(isReady)
            }}
          />

          <WeekCarousel
            selectedIndex={this.state.Day}
            markedIndex={this.props.IsCurrentWeek !=false  ? this.props.today - 1 : -1 /* current weekday can't be on 'other' week*/}
            cols={
              this.props.day.map(d => {
                const {title, date} = d;
                const weekDayShort = title;
                const dateDdDotMmDotYy = date;
                const dateDdDotMm = dateDdDotMmDotYy.slice(0, 5);
                return dateDdDotMm
                  ? this.state.formatDate(weekDayShort, dateDdDotMm)
                  : '';
              })
            }
            onSelect={(weekDayIndex) => {
              this.setState({Day:  weekDayIndex-1 + (this.state.weekParam === OTHER_WEEK ? 0 : 1)})
            }}
          />

          <ScheduleDay
            isReady={isReady}
            dayLessons={
              String(this.props.IsCurrentWeek)=="true"
                ? schedule.current_week[this.state.Day]
                : schedule.other_week[this.state.Day]
            }
            currentLessonNumber={this.state.current}
            isTeacherAndValid={this.state.isTeacher}
            isToday={this.props.today === this.state.Day && this.props.weekParam === THIS_WEEK}
            isDayOff={this.state.Day == 7}
            onTeacherClick={async (teacherName) => {
              await this.props.doSetTeacher(teacherName)
            }
          }
          />

          <Spacer200/>

        </Container>
      </div>
/*
    </DeviceThemeProvider>
*/
  )
  }
}

export default ScheduleView
