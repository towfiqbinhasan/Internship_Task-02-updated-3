<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('student-tracker', function () {
    return true;
});