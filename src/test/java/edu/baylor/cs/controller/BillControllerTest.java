package edu.baylor.cs.controller;

import edu.baylor.cs.db.tables.records.UsersRecord;
import edu.baylor.cs.service.IAuthService;
import edu.baylor.cs.service.IBillService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BillController.class)
class BillControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    IBillService billService;

    @MockBean
    IAuthService authService;

    @Test
    void payEntireBill_authenticated_returns200() throws Exception {
        UsersRecord guest = new UsersRecord();
        guest.setId(1);
        when(authService.getUserFromToken(any())).thenReturn(guest);
        doNothing().when(billService).payEntireBill(1, 12);

        mockMvc.perform(post("/api/bills/reservation/12/pay")
                        .header("Authorization", "Bearer token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Entire bill paid"));
    }
}
