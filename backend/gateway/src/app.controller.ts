import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // User Service Endpoints
  @Get('user')
  getUsers() { return this.appService.getUsers(); }

  @Get('user/:id')
  getUserById(@Param('id') id: string) { return this.appService.getUserById(id); }

  @Get('user/email/:email')
  getUserByEmail(@Param('email') email: string) { return this.appService.getUserByEmail(email); }

  @Post('user')
  createUser(@Body() createUserDto: any) { return this.appService.createUser(createUserDto); }

  @Patch('user/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: any) { return this.appService.updateUser(id, updateUserDto); }

  @Delete('user/:id')
  deleteUser(@Param('id') id: string) { return this.appService.deleteUser(id); }

  @Post('user/deleteMultipleUser')
  deleteMultipleUsers(@Body() ids: number[]) { return this.appService.deleteMultipleUsers(ids); }

  // Auth Service Endpoints
  @Post('auth/login')
  login(@Body() authUserDto: any) { return this.appService.login(authUserDto); }

  @Get('auth/login')
  loginGet(@Query('email') email: string, @Query('password') password: string) {
    return this.appService.login({ email, password });
  }

  // Activity Service Endpoints
  @Get('activities')
  getActivities() { return this.appService.getActivities(); }

  @Get('activity')
  getActivitiesAlt() { return this.appService.getActivities(); }

  @Get('activities/:id')
  getActivityById(@Param('id') id: string) { return this.appService.getActivityById(id); }

  @Get('activity/:id')
  getActivityByIdAlt(@Param('id') id: string) { return this.appService.getActivityById(id); }

  @Post('activities')
  createActivity(@Body() createActivityDto: any) { return this.appService.createActivity(createActivityDto); }

  @Post('activity')
  createActivityAlt(@Body() createActivityDto: any) { return this.appService.createActivity(createActivityDto); }

  @Patch('activities/:id')
  updateActivity(@Param('id') id: string, @Body() updateActivityDto: any) { return this.appService.updateActivity(id, updateActivityDto); }

  @Patch('activity/:id')
  updateActivityAlt(@Param('id') id: string, @Body() updateActivityDto: any) { return this.appService.updateActivity(id, updateActivityDto); }

  @Put('activities/:id/complete')
  completeActivity(@Param('id') id: string) { return this.appService.completeActivity(id); }

  @Delete('activities/:id')
  deleteActivity(@Param('id') id: string) { return this.appService.deleteActivity(id); }

  @Delete('activity/:id')
  deleteActivityAlt(@Param('id') id: string) { return this.appService.deleteActivity(id); }

  // Parent Service Endpoints
  @Get('parent')
  getParents() { return this.appService.getParents(); }

  @Get('parent/:id')
  getParentById(@Param('id') id: string) { return this.appService.getParentById(id); }

  @Post('parent')
  createParent(@Body() createParentDto: any) { return this.appService.createParent(createParentDto); }

  @Patch('parent/:id')
  updateParent(@Param('id') id: string, @Body() updateParentDto: any) { return this.appService.updateParent(id, updateParentDto); }

  @Delete('parent/:id')
  deleteParent(@Param('id') id: string) { return this.appService.deleteParent(id); }

  @Post('parent/deleteMultiple')
  deleteMultipleParents(@Body() ids: number[]) { return this.appService.deleteMultipleParents(ids); }

  // Student Service Endpoints
  @Get('student')
  getStudents() { return this.appService.getStudents(); }

  @Get('student/:id')
  getStudentById(@Param('id') id: string) { return this.appService.getStudentById(id); }

  @Post('student')
  createStudent(@Body() createStudentDto: any) { return this.appService.createStudent(createStudentDto); }

  @Put('student/:id')
  updateStudent(@Param('id') id: string, @Body() updateStudentDto: any) { return this.appService.updateStudent(id, updateStudentDto); }

  @Delete('student/:id')
  deleteStudent(@Param('id') id: string) { return this.appService.deleteStudent(id); }

  // Classroom Service Endpoints
  @Get('classroom')
  getClassrooms() { return this.appService.getClassrooms(); }

  @Get('classroom/:id')
  getClassroomById(@Param('id') id: string) { return this.appService.getClassroomById(id); }

  @Post('classroom')
  createClassroom(@Body() createClassroomDto: any) { return this.appService.createClassroom(createClassroomDto); }

  @Patch('classroom/:id')
  updateClassroom(@Param('id') id: string, @Body() updateClassroomDto: any) { return this.appService.updateClassroom(id, updateClassroomDto); }
@Delete('classroom/:id')
deleteClassroom(@Param('id') id: string) { return this.appService.deleteClassroom(id); }
  @Get('teachers')
  getTeachers() { return this.appService.getTeachers(); }

  @Get('teachers/:id')
  getTeacherById(@Param('id') id: string) { return this.appService.getTeacherById(id); }

  @Post('teachers')
  createTeacher(@Body() createTeacherDto: any) { return this.appService.createTeacher(createTeacherDto); }

  @Patch('teachers/:id')
  updateTeacher(@Param('id') id: string, @Body() updateTeacherDto: any) { return this.appService.updateTeacher(id, updateTeacherDto); }

  @Delete('teachers/:id')
  deleteTeacher(@Param('id') id: string) { return this.appService.deleteTeacher(id); }

  @Get('teachers/search')
  searchTeachers(@Query('query') query: string) { return this.appService.searchTeachers(query); }
}
