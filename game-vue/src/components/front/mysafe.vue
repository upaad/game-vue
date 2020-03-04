<template>
    <div>
        <el-container>
            <el-header>
                <indexheader></indexheader>
            </el-header>
            <el-container>
                <el-main class="main">
                    <hr class="line"/>
                    <div class="conbox">
                        <el-row>
                            <el-col :span="8">
                                <myaside></myaside>
                            </el-col>
                            <el-col :span="16">
                                <mybox></mybox>
                            </el-col>
                        </el-row>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import indexheader from '@/components/front/indexheader.vue'
import myaside from '@/components/front/mydataaside.vue'
import mybox from '@/components/front/mysafebox.vue'

export default {
  components: {
    indexheader, myaside, mybox
  },
  data () {
    return {
    }
  },
  methods: {
  }

}
</script>

<style>
.conbox{
    padding-top: 50px;
    height: 1000px;
}
.main{
    width: 100%;
    margin: 0px;
    padding: 0px;
    height: 100%;
    background-color:#f0f0f0
}
.line{
    margin: 0px;
    padding: 0px;
    height:0px;
    border:none;
    border-top:5px groove skyblue;
}

</style>
