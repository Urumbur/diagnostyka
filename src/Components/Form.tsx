import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type DepartmentType = {
  id: number,
  name: string
}

type FormSchemaType = {
  fullName: string,
  birthDate: string | Date,
  email: string,
  userDepartment: string,
  formTerms: boolean
}

const formSchema: FormSchemaType = {
  fullName: '',
  birthDate: '',
  email: '',
  userDepartment: '1',
  formTerms: false
}

const regexDatePattern = /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;
const regexEmailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;


export const Form = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting, isValid, errors },
  } = useForm<FormSchemaType>({
    defaultValues: formSchema,
    mode: 'onBlur',
  });
  const [departments, setDepartments] = useState<DepartmentType[] | []>([]);

  const getDepartments = async () => { 
    try {
      const response = await fetch('https://ddh-front-default-rtdb.europe-west1.firebasedatabase.app/departments.json');
      const data = await response.json();
      setDepartments(data);
    }
    catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getDepartments()
  }, [])

  const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
    // TODO: Wyślij dane
    try {
      const pushData = await fetch('https://ddh-front-default-rtdb.europe-west1.firebasedatabase.app/users.json', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values)
      })
      const hehe = await pushData.json();
      if (hehe?.name) alert("Dane zostały poprawnie wysłane")
    }
    catch (error) {
      console.log(error)
    }
  };

  return (
    <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <label htmlFor="user-name" className="form-label">
          Imię i nazwisko
        </label>
        <input
          {...register('fullName', {required: true})}
          type="name"
          className="form-control"
          id="user-name"
          placeholder="Imię i nazwisko"
          name="fullName"
        />
        {errors.fullName && <span className="text-danger">This field is required</span>}
      </div>
      <div className="mb-3">
        <label htmlFor="user-birth-date" className="form-label">
          Data urodzenia
        </label>
        <input
        {...register('birthDate', {required: true, pattern: regexDatePattern})}
          type="text"
          className="form-control"
          id="user-birth-date"
          placeholder="DD/MM/YYYY"
          name="birthDate"
        />
        {errors.birthDate?.type === 'required' && <span className="text-danger">This field is required</span>}
        {errors.birthDate?.type === 'pattern' && <span className="text-danger">Wrong date pattern</span>}
      </div>
      <div className="mb-3">
        <label htmlFor="user-email" className="form-label">
          Email
        </label>
        <input
        {...register('email', {required: true, pattern: regexEmailPattern})}
          type="email"
          className="form-control"
          id="user-email"
          placeholder="user@example.com"
          name="email"
        />
        {errors.email?.type === 'required' && <span className="text-danger">This field is required</span>}
        {errors.email?.type === 'pattern' && <span className="text-danger">Wrong email address</span>}
      </div>
      <div className="mb-3">
        <label htmlFor="user-department" className="form-label">
          Wydział
        </label>
        <select {...register('userDepartment')} onChange={(e) => setValue('userDepartment', e.target.value,{
          shouldValidate: true,
          shouldDirty: true
        })} className="form-select" name="department" id="user-department">
          {departments?.map((el, index) => (
            <option key={index} value={el.id}>{el.name}</option>
          ))}
        </select>
        {errors.userDepartment && <span className="text-danger">This field is required</span>}
      </div>
      <div className="form-check">
        <input
        {...register('formTerms')}
        onChange={() => setValue('formTerms', !getValues('formTerms'),{
          shouldValidate: true,
          shouldDirty: true
        })}
          className="form-check-input"
          type="checkbox"
          value=""
          id="form-terms"
          name="termsOfUse"
        />
        <label className="form-check-label" htmlFor="form-terms">
          Akceptuję regulamin
        </label>
        {!getValues('formTerms') && <p className="text-danger">This field is required</p>}
      </div>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting || !isValid}>
          Zapisz
        </button>
      </div>
    </form>
  );
};
