let SubmittingUtil = {
  submittingForm: {
    submitting: false,
    message: '数据提交中，请稍后...'
  },
  toggleSubmitting(submitting, _this) {
    _this.setData({
      'submittingForm.submitting': submitting
    });
  }
};

export default SubmittingUtil;