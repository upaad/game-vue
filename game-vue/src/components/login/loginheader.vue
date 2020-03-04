<template>
    <el-row :gutter="20">
        <el-col :span="12">
			<div class="grid-content bg-purple-dark">
				<el-image style="width: 200px; height: 100px; padding-top: 5px;"
					:src="url" @click="skip()"
					fit="contain">
				</el-image>
			</div>
		</el-col>
    </el-row>
</template>

<script>
import logo from '@/assets/logo.jpg'
export default {
  data () {
    return {
      url: logo
    }
  },
  methods: {
    skip () {
      this.$router.push({ path: '/index' })
    }
  }
}
</script>

<style>

</style>
