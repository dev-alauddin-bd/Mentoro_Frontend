import baseApi from "@/redux/baseApi/baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    /* ================= CREATE CHECKOUT ================= */
    createCheckout: build.mutation<any, { courseId: string; enrollId: string }>({
      query: ({ courseId, enrollId }) => ({
        url: "/payments/checkout",
        method: "POST",
        body: { courseId, enrollId },
      }),
      invalidatesTags: ["Course", "Payment"],
    }),

    /* ================= REFUND COURSE ================= */
    refundCourse: build.mutation<any, string>({
      query: (courseId) => ({
        url: "/payments/refund",
        method: "POST",
        body: { courseId },
      }),
      invalidatesTags: ["Course", "Payment"],
    }),

    /* ================= PAYMENT SUCCESS CALLBACK ================= */
    paymentSuccess: build.query<
      any,
      { transactionId?: string }
    >({
      query: (params) => ({
        url: "/payments/success",
        method: "GET",
        params,
      }),
      providesTags: ["Payment"],
    }),

    /* ================= PAYMENT FAIL ================= */
    paymentFail: build.query<
      any,
      void
    >({
      query: () => ({
        url: "/payments/fail",
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),

    /* ================= PAYMENT CANCEL ================= */
    paymentCancel: build.query<any, void>({
      query: () => ({
        url: "/payments/cancel",
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),

  }),
});

/* ================= HOOKS ================= */
export const {
  useCreateCheckoutMutation,
  useRefundCourseMutation,
  useLazyPaymentSuccessQuery,
  useLazyPaymentFailQuery,
  useLazyPaymentCancelQuery,
} = paymentApi;