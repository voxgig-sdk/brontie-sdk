package core

type BrontieError struct {
	IsBrontieError bool
	Sdk              string
	Code             string
	Msg              string
	Ctx              *Context
	Result           any
	Spec             any
}

func NewBrontieError(code string, msg string, ctx *Context) *BrontieError {
	return &BrontieError{
		IsBrontieError: true,
		Sdk:              "Brontie",
		Code:             code,
		Msg:              msg,
		Ctx:              ctx,
	}
}

func (e *BrontieError) Error() string {
	return e.Msg
}
