package com.openclassrooms.starterjwt.service;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceTest {

    @Mock
    TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService classUnderTest;

    private Teacher teacher1;
    private Teacher teacher2;

    @BeforeEach
    public void setup() {
        // Ici, Mockito injectera automatiquement les mocks dans classUnderTest, grâce à InjectMocks.

        // Initialiser les infos ici pour ne pas les répéter dans les tests
        teacher1 = new Teacher();
        teacher1.setLastName("Dixon");
        teacher1.setFirstName("Daryl");

        teacher2 = new Teacher();
        teacher2.setLastName("Grims");
        teacher2.setFirstName("Rick");
    }

    @Test
    public void teacher_findAll_ShouldReturnListTeachers_WhenTeachersExist() {
        // GIVEN : Initialiser une liste de professeurs
        List<Teacher> expectedTeachers = Arrays.asList(teacher1, teacher2);
        given(teacherRepository.findAll()).willReturn(expectedTeachers);

        // WHEN : Appeler la méthode findAll du service
        List<Teacher> actualTeachers = classUnderTest.findAll();

        // THEN : Vérifier que la méthode findAll a été appelée et que le contenu est correct
        then(teacherRepository).should().findAll();
        assertThat(actualTeachers).isNotNull();
        assertThat(actualTeachers).hasSize(2);  // Vérifie que la liste a deux éléments
        assertThat(actualTeachers).containsExactlyElementsOf(expectedTeachers);  // Vérifie que le contenu correspond
    }

    @Test
    public void teacher_findById_ShouldReturnTeacher_WhenTeacherExist() {
        // GIVEN : Initialiser un professeur
        Long teacherId = 1L;
        teacher1.setId(teacherId);

        // Simuler un appel à findById avec un id spécifique. Et retourner un Optional<Teacher> contenant un professeur précis
        given(teacherRepository.findById(teacherId)).willReturn(Optional.of(teacher1));

        // WHEN : Appeler la méthode findById du service
        Teacher actualTeacher = classUnderTest.findById(teacherId);

        // THEN : Vérifier que la méthode findById a été appelée et que le contenu est correct
        then(teacherRepository).should().findById(teacherId);
        assertThat(actualTeacher).isNotNull();
        assertThat(actualTeacher.getId()).isEqualTo(teacherId);
        assertThat(actualTeacher.getLastName()).isEqualTo("Dixon");
        assertThat(actualTeacher.getFirstName()).isEqualTo("Daryl");
    }
}
