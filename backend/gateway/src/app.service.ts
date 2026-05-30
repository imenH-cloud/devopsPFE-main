import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  getHello(): string {
    return 'Hello World!';
  }

  // ============ AUTH SERVICE METHODS ============
  async login(authUserDto: any) {
    try {
      const response = await lastValueFrom(
        this.httpService.post('http://auth-service:3001/auth/login', authUserDto)
      );
      return response.data;
    } catch (error) {
      console.error('Login error:', error.message || error);
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw error;
    }
  }

  // ============ USER SERVICE METHODS ============
  async getUsers() {
    const response = await lastValueFrom(
      this.httpService.get('http://user-service:3002/user')
    );
    return response.data;
  }

  async getUserById(id: string) {
    const response = await lastValueFrom(
      this.httpService.get(`http://user-service:3002/user/${id}`)
    );
    return response.data;
  }

  async getUserByEmail(email: string) {
    const response = await lastValueFrom(
      this.httpService.get(`http://user-service:3002/user/email/${email}`)
    );
    return response.data;
  }

  async createUser(createUserDto: any) {
    const response = await lastValueFrom(
      this.httpService.post('http://user-service:3002/user', createUserDto)
    );
    return response.data;
  }

  async updateUser(id: string, updateUserDto: any) {
    const response = await lastValueFrom(
      this.httpService.patch(`http://user-service:3002/user/${id}`, updateUserDto)
    );
    return response.data;
  }

  async deleteUser(id: string) {
    const response = await lastValueFrom(
      this.httpService.delete(`http://user-service:3002/user/${id}`)
    );
    return response.data;
  }

  async deleteMultipleUsers(ids: number[]) {
    const response = await lastValueFrom(
      this.httpService.post('http://user-service:3002/user/deleteMultipleUser', ids)
    );
    return response.data;
  }

  // ============ ACTIVITY SERVICE METHODS ============
  async getActivities() {
    const response = await lastValueFrom(
      this.httpService.get('http://activity-service:3003/activities?page=1&limit=100')
    );
    return response.data;
  }

  async getActivityById(id: string) {
    const response = await lastValueFrom(
      this.httpService.get(`http://activity-service:3003/activities/${id}`)
    );
    return response.data;
  }

  async createActivity(createActivityDto: any) {
    const response = await lastValueFrom(
      this.httpService.post('http://activity-service:3003/activities', createActivityDto)
    );
    return response.data;
  }

  async updateActivity(id: string, updateActivityDto: any) {
    const response = await lastValueFrom(
      this.httpService.patch(`http://activity-service:3003/activities/${id}`, updateActivityDto)
    );
    return response.data;
  }

  async completeActivity(id: string) {
    const response = await lastValueFrom(
      this.httpService.put(`http://activity-service:3003/activities/${id}/complete`, {})
    );
    return response.data;
  }

  async deleteActivity(id: string) {
    const response = await lastValueFrom(
      this.httpService.delete(`http://activity-service:3003/activities/${id}`)
    );
    return response.data;
  }

  // ============ PARENT SERVICE METHODS ============
  async getParents() {
    const response = await lastValueFrom(
      this.httpService.get('http://parent-service:3004/parent')
    );
    return response.data;
  }

  async getParentById(id: string) {
    const response = await lastValueFrom(
      this.httpService.get(`http://parent-service:3004/parent/${id}`)
    );
    return response.data;
  }

  async createParent(createParentDto: any) {
    const response = await lastValueFrom(
      this.httpService.post('http://parent-service:3004/parent', createParentDto)
    );
    return response.data;
  }

  async updateParent(id: string, updateParentDto: any) {
    const response = await lastValueFrom(
      this.httpService.patch(`http://parent-service:3004/parent/${id}`, updateParentDto)
    );
    return response.data;
  }

  async deleteParent(id: string) {
    const response = await lastValueFrom(
      this.httpService.delete(`http://parent-service:3004/parent/${id}`)
    );
    return response.data;
  }

  async deleteMultipleParents(ids: number[]) {
    const response = await lastValueFrom(
      this.httpService.post('http://parent-service:3004/parent/deleteMultiple', ids)
    );
    return response.data;
  }

  // ============ STUDENT SERVICE METHODS ============
  async getStudents() {
    const response = await lastValueFrom(
      this.httpService.get('http://student-service:3005/student')
    );
    return response.data;
  }

  async getStudentById(id: string) {
    const response = await lastValueFrom(
      this.httpService.get(`http://student-service:3005/student/${id}`)
    );
    return response.data;
  }

  async createStudent(createStudentDto: any) {
    const response = await lastValueFrom(
      this.httpService.post('http://student-service:3005/student', createStudentDto)
    );
    return response.data;
  }

  async updateStudent(id: string, updateStudentDto: any) {
    const response = await lastValueFrom(
      this.httpService.put(`http://student-service:3005/student/${id}`, updateStudentDto)
    );
    return response.data;
  }

  async deleteStudent(id: string) {
    const response = await lastValueFrom(
      this.httpService.delete(`http://student-service:3005/student/${id}`)
    );
    return response.data;
  }

  // ============ CLASSROOM SERVICE METHODS ============
  async getClassrooms() {
    const response = await lastValueFrom(
      this.httpService.get('http://classroom-service:3006/classroom')
    );
    return response.data;
  }

  async getClassroomById(id: string) {
    const response = await lastValueFrom(
      this.httpService.get(`http://classroom-service:3006/classroom/${id}`)
    );
    return response.data;
  }

  async createClassroom(createClassroomDto: any) {
    const response = await lastValueFrom(
      this.httpService.post('http://classroom-service:3006/classroom', createClassroomDto)
    );
    return response.data;
  }

  async updateClassroom(id: string, updateClassroomDto: any) {
    const response = await lastValueFrom(
      this.httpService.patch(`http://classroom-service:3006/classroom/${id}`, updateClassroomDto)
    );
    return response.data;
  }

  async deleteClassroom(id: string) {
    const response = await lastValueFrom(
      this.httpService.delete(`http://classroom-service:3006/classroom/${id}`)
    );
    return response.data;
  }

  // ============ TEACHER SERVICE METHODS ============
  async getTeachers() {
    const response = await lastValueFrom(
      this.httpService.get('http://teacher-service:3007/teachers?page=1&limit=100')
    );
    return response.data;
  }

  async getTeacherById(id: string) {
    const response = await lastValueFrom(
      this.httpService.get(`http://teacher-service:3007/teachers/${id}`)
    );
    return response.data;
  }

  async createTeacher(createTeacherDto: any) {
    const response = await lastValueFrom(
      this.httpService.post('http://teacher-service:3007/teachers', createTeacherDto)
    );
    return response.data;
  }

  async updateTeacher(id: string, updateTeacherDto: any) {
    const response = await lastValueFrom(
      this.httpService.patch(`http://teacher-service:3007/teachers/${id}`, updateTeacherDto)
    );
    return response.data;
  }

  async deleteTeacher(id: string) {
    const response = await lastValueFrom(
      this.httpService.delete(`http://teacher-service:3007/teachers/${id}`)
    );
    return response.data;
  }

  async searchTeachers(query: string) {
    const response = await lastValueFrom(
      this.httpService.get(`http://teacher-service:3007/teachers/search?query=${query}`)
    );
    return response.data;
  }
}
