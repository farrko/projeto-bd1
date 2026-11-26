import { useState, useEffect } from 'react'
import { ComposedModal, ModalHeader, ModalBody, ModalFooter, TextInput, Button, InlineNotification, Stack, PasswordInput } from '@carbon/react'
import { createTeacher, updateTeacher, createStudent, updateStudent, ApiError, type Teacher, type Student, type Role } from '../../api'

type UserRecord = Teacher | Student;

interface UserFormModalProps {
  open: boolean;
  role: Role;
  user: UserRecord | null;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export const UserFormModal = ({ open, role, user, onClose, onSuccess }: UserFormModalProps) => {
  const isEdit = user !== null;
  const isTeacher = role === 'TEACHER';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setErrorMessage(null);

    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPassword('');
      setCode(user.role === 'TEACHER' ? user.staffNumber : user.enrollmentNumber);
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setCode('');
    }
  }, [open, user]);

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (!name.trim() || !email.trim() || !code.trim()) {
      setErrorMessage('Name, email, and registration number are required.');
      return;
    }
    if (!isEdit && !password.trim()) {
      setErrorMessage('Password is required when creating a new user.');
      return;
    }

    setSubmitting(true);

    try {
      if (isTeacher) {
        if (isEdit && user) {
          const updates: Partial<Teacher> = {};

          if (name.trim() !== user.name) updates.name = name.trim();
          if (email.trim() !== user.email) updates.email = email.trim();
          if (password.trim()) updates.password = password.trim();
          if (user.role === 'TEACHER' && code.trim() !== user.staffNumber) {
            updates.staffNumber = code.trim();
          }

          await updateTeacher(user.id, updates);
        } else {
          await createTeacher({
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
            role: 'TEACHER',
            staffNumber: code.trim(),
          });
        }
      } else {
        if (isEdit && user) {
          const updates: Partial<Student> = {};

          if (name.trim() !== user.name) updates.name = name.trim();
          if (email.trim() !== user.email) updates.email = email.trim();
          if (password.trim()) updates.password = password.trim();
          if (user.role === 'STUDENT' && code.trim() !== user.enrollmentNumber) {
            updates.enrollmentNumber = code.trim();
          }

          await updateStudent(user.id, updates);
        } else {
          await createStudent({
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
            role: 'STUDENT',
            enrollmentNumber: code.trim(),
          });
        }
      }

      await onSuccess();
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(`${err.code}: ${err.message}`);
      } else {
        setErrorMessage(err instanceof Error ? err.message : 'Operation failed.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const title = `${isEdit ? 'Edit' : 'New'} ${isTeacher ? 'Teacher' : 'Student'}`;

  return (
    <ComposedModal open={open} onClose={onClose} size="sm">
      <ModalHeader
        label={isTeacher ? 'Faculty Account' : 'Student Account'}
        title={title}
      />
      <ModalBody>
        <Stack gap={5}>
          {errorMessage && (
            <InlineNotification
              kind="error"
              title="Request Failed"
              subtitle={errorMessage}
              onCloseButtonClick={() => setErrorMessage(null)}
            />
          )}

          <TextInput
            id="user-form-name"
            labelText="Full Name"
            placeholder="e.g. Prof. Anderson Paulo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
          />

          <TextInput
            id="user-form-email"
            type="email"
            labelText="Email"
            placeholder="name@uel.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />

          <TextInput
            id="user-form-code"
            labelText={isTeacher ? 'Staff Number' : 'Enrollment Number'}
            placeholder={isTeacher ? 'e.g. T-1042' : 'e.g. 202600123'}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={submitting}
          />

          <PasswordInput
            id="user-form-password"
            labelText={isEdit ? 'New Password (leave blank to keep current)' : 'Password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
          />
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button kind="primary" onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create'}
        </Button>
      </ModalFooter>
    </ComposedModal>
  )
}
