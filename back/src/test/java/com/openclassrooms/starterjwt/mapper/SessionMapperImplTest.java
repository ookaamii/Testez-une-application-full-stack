package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.services.SessionService;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

@ExtendWith(MockitoExtension.class)
class SessionMapperImplTest {

    @Mock
    private TeacherService teacherService;

    @Mock
    private UserService userService;

    @Mock
    private SessionService sessionService;

    @Mock
    private SessionRepository sessionRepository;

    @InjectMocks
    private SessionMapperImpl sessionMapper;

    @BeforeEach
    public void setup() {
        // Ici, Mockito injectera automatiquement les mocks dans sessionMapper, grâce à InjectMocks.
    }

    @Test
    void sessionMapper_toEntity_ShouldMapTeacherAndUsers() {
        // GIVEN
        SessionDto dto = new SessionDto();
        dto.setTeacher_id(1L);
        dto.setUsers(Arrays.asList(2L, 3L));

        Teacher mockTeacher = new Teacher();
        mockTeacher.setId(1L);

        User user1 = new User();
        user1.setId(2L);

        User user2 = new User();
        user2.setId(3L);

        given(teacherService.findById(1L)).willReturn(mockTeacher);
        given(userService.findById(2L)).willReturn(user1);
        given(userService.findById(3L)).willReturn(user2);

        // WHEN
        Session session = sessionMapper.toEntity(dto);

        // THEN
        assertThat(session.getTeacher()).isEqualTo(mockTeacher);
        assertThat(session.getUsers()).containsExactly(user1, user2);
    }

    @Test
    void sessionMapper_toDto_ShouldMapTeacherAndUserIds() {
        // GIVEN
        Teacher teacher = new Teacher();
        teacher.setId(1L);

        User user1 = new User();
        user1.setId(2L);

        User user2 = new User();
        user2.setId(3L);

        Session session = Session.builder()
                .teacher(teacher)
                .users(Arrays.asList(user1, user2))
                .build();

        // WHEN
        SessionDto dto = sessionMapper.toDto(session);

        // THEN
        assertThat(dto.getTeacher_id()).isEqualTo(1L);
        assertThat(dto.getUsers()).containsExactly(2L, 3L);
    }

    @Test
    void sessionMapper_toDto_sessionTeacherId_ShouldReturnNull_WhenSessionDtoIsNull() {
        // GIVEN : Une session nulle
        Session session = null;

        // WHEN : Mapper la session nulle en DTO
        SessionDto dto = sessionMapper.toDto(session);

        // THEN : Vérifier que le DTO est null lorsqu'il n'y a pas de session
        assertThat(dto).isNull();
    }

    @Test
    void sessionMapper_toDto_sessionTeacherId_ShouldReturnNullTeacherId_WhenTeacherDtoIsNull() {
        // GIVEN : Simuler une session avec un teacher null
        Session session = Session.builder().teacher(null).build();

        // WHEN : Mapper la session en DTO
        SessionDto dto = sessionMapper.toDto(session);

        // THEN : Vérifier que le teacher_id est null
        assertThat(dto.getTeacher_id()).isNull();
    }

    @Test
    void sessionMapper_toDto_sessionTeacherId_ShouldReturnNull_WhenTeacherIdIsNull() {
        // GIVEN : Simuler une session avec un teacher ayant un ID null
        Teacher teacher = new Teacher();
        teacher.setId(null);

        Session session = Session.builder().teacher(teacher).build();

        // WHEN : Mapper la session en DTO
        SessionDto dto = sessionMapper.toDto(session);

        // THEN : Vérifier que le teacher_id dans le DTO est null
        assertThat(dto.getTeacher_id()).isNull();
    }
}