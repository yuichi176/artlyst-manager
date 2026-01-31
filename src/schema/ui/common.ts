export type FormSubmitState =
  | {
      status: 'pending'
      errors: undefined
    }
  | {
      status: 'success'
      errors: undefined
    }
  | {
      status: 'error'
      errors: Record<string, string>
    }
